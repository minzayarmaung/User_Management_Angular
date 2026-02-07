import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: 'success' | 'error' | 'info' = 'success') {
    const newToast: Toast = { message, type };
    this.toasts.update((current) => [...current, newToast]);

    setTimeout(() => {
      this.remove(newToast);
    }, 3000);
  }

  // Helper to remove a specific toast when user clicks 'X'
  remove(toast: Toast) {
    this.toasts.update((current) => current.filter((t) => t !== toast));
  }

  clearAll() {
    this.toasts.set([]);
  }
}