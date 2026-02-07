import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div class="w-24 h-24 bg-indigo-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
          @if (authService.currentUser()?.profilePicUrl) {
            <img [src]="authService.currentUser()?.profilePicUrl" class="rounded-full w-full h-full object-cover">
          } @else {
            {{ authService.currentUser()?.username?.charAt(0)?.toUpperCase() }}
          }
        </div>

        <h1 class="text-3xl font-extrabold text-gray-900 mb-2">
          Welcome, {{ authService.currentUser()?.username }}!
        </h1>
        <p class="text-gray-600 mb-8">
          You are logged in as <span class="font-semibold text-indigo-600">{{ authService.currentUser()?.role }}</span>.
        </p>

        <div class="space-y-3">
          <button (click)="logout()" 
                  class="w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}