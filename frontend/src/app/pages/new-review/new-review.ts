import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReviewApiService } from '../../core/services/review-api.service';

@Component({
  selector: 'app-new-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-review.html',
  styleUrl: './new-review.css'
})
export class NewReviewComponent {
  private api = inject(ReviewApiService);
  private router = inject(Router);

  codePayload = '';
  isSubmitting = false;
  errorMessage = '';

  submitReview() {
    if (!this.codePayload.trim()) return;
    
    this.isSubmitting = true;
    this.errorMessage = '';

    // Correctly sending 'code' per your Java DTO
    this.api.submitReview({ code: this.codePayload }).subscribe({
      next: (response) => {
        const saved = localStorage.getItem('recentReviews');
        const recent: string[] = saved ? JSON.parse(saved) : [];
        const updated = [response.jobId, ...recent.filter(id => id !== response.jobId)].slice(0, 10);
        localStorage.setItem('recentReviews', JSON.stringify(updated));

        this.router.navigate(['/reviews', response.jobId, 'progress']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to submit job. Ensure backend is running on :8081';
        console.error(err);
      }
    });
  }
}