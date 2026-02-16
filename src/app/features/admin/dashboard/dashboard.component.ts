import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  // Signals for placeholder data
  stats = signal({
    totalUsers: 0,
    activeUsers: 0,
    bannedUsers: 0,
    adminUsers: 0,
    normalUsers: 0
  });

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    // Leave API blank for now
    // Once backend is ready, fetch data and use this.stats.set(res.data);
    this.stats.set({
      totalUsers: 150,
      activeUsers: 142,
      bannedUsers: 8,
      adminUsers: 5,
      normalUsers: 145
    });
  }
}