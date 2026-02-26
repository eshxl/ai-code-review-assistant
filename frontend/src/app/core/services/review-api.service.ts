import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CreateReviewRequest, JobResponse, ReviewResultsResponse } from '../models/dto';

@Injectable({
  providedIn: 'root'
})
export class ReviewApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // 1. Submit Code -> Returns Job ID
  submitReview(request: CreateReviewRequest): Observable<JobResponse> {
    return this.http.post<JobResponse>(`${this.apiUrl}/reviews`, request);
  }

  // 2. Poll Job Status
  getJobStatus(jobId: string): Observable<JobResponse> {
    return this.http.get<JobResponse>(`${this.apiUrl}/jobs/${jobId}`);
  }

  // 3. Get Aggregated Results
  getReviewResults(reviewId: string): Observable<ReviewResultsResponse> {
    return this.http.get<ReviewResultsResponse>(`${this.apiUrl}/reviews/${reviewId}/results`);
  }
}