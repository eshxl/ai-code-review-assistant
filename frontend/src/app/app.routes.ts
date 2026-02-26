import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent) },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent) },
  { path: 'reviews/new', loadComponent: () => import('./pages/new-review/new-review').then(m => m.NewReviewComponent) },
  { path: 'reviews/:id/progress', loadComponent: () => import('./pages/job-progress/job-progress').then(m => m.JobProgressComponent) },
  { path: 'reviews/:id/result', loadComponent: () => import('./pages/review-workspace/review-workspace').then(m => m.ReviewWorkspaceComponent) }
];