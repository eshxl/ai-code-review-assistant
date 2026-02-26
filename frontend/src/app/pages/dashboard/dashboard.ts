import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  recentReviews: string[] = [];
  showConfirmDialog = false; // <-- Controls the modal

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    const saved = localStorage.getItem('recentReviews');
    if (saved) {
      this.recentReviews = JSON.parse(saved);
    }
  }

  confirmClear() {
    localStorage.removeItem('recentReviews');
    this.recentReviews = [];
    this.showConfirmDialog = false;
  }
}