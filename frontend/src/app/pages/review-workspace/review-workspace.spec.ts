import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
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
  template: `
    <div class="h-[85vh] flex gap-4 mt-4 overflow-hidden">
      
      <!-- Left Panel: Findings -->
      <div class="w-1/3 bg-[#0d1117] border border-gray-800 rounded-lg flex flex-col overflow-hidden shadow-lg">
        <div class="p-4 border-b border-gray-800 bg-[#161b22] flex justify-between items-center">
          <h3 class="font-bold text-gray-100 text-xs uppercase tracking-widest">Review Findings</h3>
          <span *ngIf="!isBlocked" class="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
            {{ getScannedIssuesCount() }} Issues
          </span>
        </div>
        
        <div class="flex-grow overflow-y-auto p-4 space-y-3 bg-[#0d1117] custom-scrollbar">
          <div *ngIf="isLoading" class="flex flex-col items-center justify-center h-full opacity-50 font-mono text-xs">
             <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mb-2"></div>
             [ ANALYZING ]
          </div>
          
          <div *ngIf="!isLoading && results">
            <div *ngFor="let group of results.findings | keyvalue">
              <h4 class="text-[10px] font-bold uppercase text-gray-600 mb-2 mt-4 border-b border-gray-800 pb-1 tracking-tighter">
                {{ group.key }} Severity
              </h4>
              <div *ngFor="let finding of group.value" 
                   (click)="selectFinding(finding)"
                   class="p-3 mb-2 rounded border cursor-pointer transition-all duration-150"
                   [ngClass]="selectedFinding === finding ? 'bg-blue-600/10 border-blue-500' : 'bg-[#161b22] border-gray-800 hover:border-gray-700'">
                <div class="flex justify-between items-start mb-1">
                  <span class="font-mono text-[9px] text-blue-400 uppercase">{{ finding.tool }}</span>
                </div>
                <p class="text-xs text-gray-300 line-clamp-2 leading-snug">{{ finding.message }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="w-2/3 flex flex-col gap-4 min-h-0">
        <!-- AI Insights -->
        <div class="bg-[#0d1117] border border-gray-800 rounded-lg p-6 h-1/4 overflow-y-auto shadow-lg shrink-0">
          <div class="flex items-center gap-2 mb-3 border-b border-gray-800 pb-2">
            <span class="text-lg">🤖</span>
            <h3 class="text-sm font-semibold text-gray-100">AI Logic</h3>
          </div>
          <p class="text-gray-400 text-sm leading-relaxed">{{ selectedFinding?.ai?.explanation || 'Select an issue to view analysis.' }}</p>
        </div>

        <!-- Diff Viewer Box (THE FIX AREA) -->
        <div class="bg-[#1e1e1e] border border-gray-800 rounded-lg flex flex-col flex-1 overflow-hidden relative shadow-2xl">
          <div class="h-10 px-4 bg-[#161b22] border-b border-gray-800 text-[10px] font-mono text-gray-500 flex items-center justify-between shrink-0 z-30">
             <div class="flex items-center gap-2">
               <span class="w-2 h-2 rounded-full bg-blue-500"></span>
               <span class="uppercase tracking-widest">Patch Diff</span>
             </div>
             <button *ngIf="formattedPatch" (click)="downloadPatch()" class="text-blue-400 hover:text-white transition-colors font-bold">DOWNLOAD .DIFF</button>
          </div>
          
          <!-- The container must be relative and flex-1 -->
          <div class="flex-1 relative w-full overflow-hidden bg-[#1e1e1e]">
            <!-- The Editor must be absolute inset-0 to fill the flex container -->
            <ngx-monaco-editor 
                *ngIf="formattedPatch"
                class="absolute inset-0 w-full h-full block"
                [options]="editorOptions" 
                [ngModel]="formattedPatch">
            </ngx-monaco-editor>
            
            <div *ngIf="!formattedPatch" class="absolute inset-0 flex items-center justify-center text-gray-700 font-mono text-[10px]">
              [ NO DIFF DATA AVAILABLE ]
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
    /* Force internal Monaco containers to expand */
    ::ng-deep .editor-container { 
      height: 100% !important; 
      width: 100% !important;
    }
    ::ng-deep ngx-monaco-editor {
      height: 100% !important;
      display: block;
    }
    .custom-scrollbar::-webkit-scrollbar { width: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #30363d; border-radius: 10px; }
  `]
})
export class ReviewWorkspaceComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ReviewApiService);
  private cdr = inject(ChangeDetectorRef);

  results: ReviewResultsResponse | null = null;
  selectedFinding: FindingResultDTO | null = null;
  isLoading = true;
  isBlocked = false;

  editorOptions = { 
    theme: 'vs-dark', 
    language: 'diff', 
    readOnly: true,
    minimap: { enabled: false },
    automaticLayout: true, // Allows editor to re-measure parent size
    scrollBeyondLastLine: false,
    fontSize: 12,
    renderLineHighlight: 'all',
    scrollbar: { vertical: 'visible', horizontal: 'visible' }
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.fetchResults(id);
  }

  fetchResults(id: string) {
    this.api.getReviewResults(id).subscribe({
      next: (data) => {
        this.results = data;
        this.isLoading = false;
        if (data.findings) {
          const firstKey = Object.keys(data.findings)[0];
          const firstList = (data.findings as any)[firstKey];
          if (firstList?.length) this.selectedFinding = firstList[0];
        }
        this.cdr.detectChanges(); 
      },
      error: () => this.isLoading = false
    });
  }

  selectFinding(finding: FindingResultDTO) {
    this.selectedFinding = finding;
    this.cdr.detectChanges();
  }

  getScannedIssuesCount(): number {
    if (!this.results?.findings) return 0;
    return Object.values(this.results.findings).reduce((acc, curr) => acc + (curr?.length || 0), 0);
  }

  get formattedPatch(): string {
    const raw = this.selectedFinding?.ai?.patch || '';
    if (!raw) return '';
    
    // Clean markdown blocks
    let patch = raw.replace(/```diff\n?/g, '').replace(/```\n?/g, '').trim();
    
    // CRITICAL FIX: Strip all leading spaces from lines starting with + or -
    // Monaco DIFF highlighter ONLY works if + and - are at column 0.
    return patch.split('\n').map((line: string) => {
      const trimmedLine = line.trimStart();
      if (trimmedLine.startsWith('+') || trimmedLine.startsWith('-')) {
        return trimmedLine;
      }
      return line;
    }).join('\n');
  }

  downloadPatch() {
    const blob = new Blob([this.formattedPatch], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patch-${Date.now()}.diff`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
