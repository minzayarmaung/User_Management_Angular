import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  // A signal holding an array of active toasts
  toasts = signal<Toast[]>([]);

  show(message: string, type: 'success' | 'error' | 'info' = 'success') {
    const newToast: Toast = { message, type };
    
    // Add new toast to the list
    this.toasts.update((current) => [...current, newToast]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      this.toasts.update((current) => current.filter((t) => t !== newToast));
    }, 3000);
  }
}