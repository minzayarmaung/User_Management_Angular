import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value 
    ? { passwordMismatch: true } 
    : null;
};

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isPasswordVisible = signal(false);
  passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  signupForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator }); 

  togglePasswordVisibility() {
    this.isPasswordVisible.update(v => !v);
  }

  onSubmit() {
    if (this.signupForm.invalid) return;

    const { confirmPassword, ...signupData } = this.signupForm.getRawValue();

    this.authService.signup(signupData).subscribe({
      next: (res) => {
        this.toastService.show(res.message, 'success');
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        this.toastService.show(err.error?.message || 'Signup failed', 'error');
      }
    });
  }
}