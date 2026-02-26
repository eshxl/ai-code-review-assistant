import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReviewApiService } from '../../core/services/review-api.service';
import { ReviewResultsResponse, FindingResultDTO } from '../../core/models/dto';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

@Component({
  selector: 'app-review-workspace',
  standalone: true,
  imports: [CommonModule, RouterLink, KeyValuePipe, FormsModule, MonacoEditorModule],
  templateUrl: './review-workspace.html',
  styleUrl: './review-workspace.css'
})
export class ReviewWorkspaceComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private api = inject(ReviewApiService);
  private cdr = inject(ChangeDetectorRef); // to handle Monaco's zone escapes

  reviewId = '';
  results: ReviewResultsResponse | null = null;
  isLoading = true;
  errorMessage = '';
  selectedFinding: FindingResultDTO | null = null;
  isBlocked = false;
  isExpanded = false;

  readonly severityOrder = ['critical', 'high', 'medium', 'low', 'convention'];

  diffOptions = {
    theme: 'vs-dark',
    readOnly: true,
    renderSideBySide: true,
    minimap: { enabled: false },
    automaticLayout: true
  };

  originalModel = { code: '', language: 'python' };
  modifiedModel = { code: '', language: 'python' };

  ngOnInit(): void {
    this.reviewId = this.route.snapshot.paramMap.get('id') || '';
    if (this.reviewId) {
      this.fetchResults();
    }
  }

  fetchResults(): void {
    this.api.getReviewResults(this.reviewId).subscribe({
      next: (data) => {
        this.results = data;
        this.isLoading = false;

        if ((data as any).status === 'BLOCKED' || data.blocked === true) {
          this.isBlocked = true;
          this.cdr.detectChanges(); // Force update
          return;
        }

        if (data.findings) {
          for (const severity of this.severityOrder) {
            const findings = data.findings[severity];
            if (findings && findings.length > 0) {
              this.selectFinding(findings[0]);
              break;
            }
          }
        }
        
        this.cdr.detectChanges(); // ✅ Force Angular to clear the loading spinner
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load results from server.';
        this.cdr.detectChanges(); // Force update on error
      }
    });
  }

  getFindings(severity: string): FindingResultDTO[] {
    return this.results?.findings?.[severity] ?? [];
  }

  selectFinding(finding: FindingResultDTO): void {
    this.selectedFinding = finding;
    this.isExpanded = false; // <-- Reset toggle when clicking a new issue

    if (finding.ai?.originalCode && finding.ai?.fixedCode) {
      this.originalModel = {
        code: finding.ai.originalCode,
        language: 'python'
      };
      this.modifiedModel = {
        code: finding.ai.fixedCode,
        language: 'python'
      };
    } else {
      this.originalModel = { code: '', language: 'python' };
      this.modifiedModel = { code: '', language: 'python' };
    }
    
    this.cdr.detectChanges();
  }

  getScannedIssuesCount(): number {
    if (!this.results?.findings) return 0;

    return this.severityOrder.reduce((total, severity) => {
      return total + (this.results?.findings?.[severity]?.length ?? 0);
    }, 0);
  }

  downloadPatch(): void {
    // Fallback to downloading fixedCode if patch string isn't used anymore
    const contentToDownload = this.selectedFinding?.ai?.patch || this.selectedFinding?.ai?.fixedCode;
    if (!contentToDownload) return;

    const blob = new Blob([contentToDownload], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `fix-${this.selectedFinding?.findingId?.substring(0, 8) || 'code'}.diff`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  }
  
  copyPatch(): void {
    const code = this.modifiedModel.code;
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      // Optional: Add a quick toast notification logic here if desired
      console.log('Patch copied to clipboard!');
    });
  }
}