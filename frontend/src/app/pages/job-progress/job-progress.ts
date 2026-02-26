import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewApiService } from '../../core/services/review-api.service';
import { timer } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-job-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-progress.html',
  styleUrl: './job-progress.css'
})
export class JobProgressComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ReviewApiService);
  
  jobId: string = '';
  status: string = 'QUEUED';
  errorMessage: string = '';

  ngOnInit() {
    this.jobId = this.route.snapshot.paramMap.get('id') || '';
    if (this.jobId) this.startPolling();
  }

  startPolling() {
    timer(0, 2000).pipe(
      switchMap(() => this.api.getJobStatus(this.jobId)),
      // RxJS purely handles the subscription lifecycle based on status
      takeWhile(res => !['COMPLETED', 'BLOCKED', 'FAILED'].includes(res.status), true) 
    ).subscribe({
      next: (response) => {
        this.status = response.status;
        this.errorMessage = response.errorMessage || '';

        // Pass the job status in router state to handle BLOCKED gracefully
        if (this.status === 'COMPLETED' || this.status === 'BLOCKED') {
          this.router.navigate(['/reviews', this.jobId, 'result'], { state: { jobStatus: this.status } });
        }
      },
      error: () => {
        this.status = 'FAILED';
        this.errorMessage = 'Lost connection to backend server.';
      }
    });
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}