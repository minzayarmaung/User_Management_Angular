import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink , CommonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  isPasswordVisible = signal(false);

  // Brute force prevention state
  failedAttempts = signal(0);
  isLocked = signal(false);
  countdown = signal(0);
  private timer: any;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  togglePasswordVisibility() {
    this.isPasswordVisible.update(v => !v);
  }

  onSubmit() {
    if (this.loginForm.invalid || this.isLocked()) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.failedAttempts.set(0); // Reset on successful login
        this.toastService.show(res.message, 'success');
        const targetRoute = res.data.role === 'ADMIN' ? '/admin' : '/home';
        this.router.navigate([targetRoute]);
      },
      error: (err) => {
        this.failedAttempts.update(count => count + 1);
        
        if (this.failedAttempts() >= 3) {
          this.startLockdown();
        } else {
          this.toastService.show(err.error?.message || 'Login failed', 'error');
        }
      }
    });
  }

  private startLockdown() {
    this.isLocked.set(true);
    this.countdown.set(60); 
    this.toastService.show('Too many failed attempts. Please wait 1 minute.', 'error');

    this.timer = setInterval(() => {
      this.countdown.update(time => time - 1);
      if (this.countdown() <= 0) {
        this.unlock();
      }
    }, 1000);
  }

  private unlock() {
    if (this.timer) clearInterval(this.timer);
    this.isLocked.set(false);
    this.failedAttempts.set(0);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}