import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  if (user) {
    return checkRole(user, route, router);
  }

  return authService.getUserProfile().pipe(
    take(1), 
    map(res => {
      if (res.success && res.data) {
        return checkRole(res.data, route, router);
      }
      router.navigate(['/login']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};

function checkRole(user: any, route: any, router: Router): boolean {
  const expectedRole = route.data['role'];
  if (expectedRole && user.role !== expectedRole) {
    const target = user.role === 'ADMIN' ? '/admin' : '/home';
    router.navigate([target]);
    return false;
  }
  return true;
}