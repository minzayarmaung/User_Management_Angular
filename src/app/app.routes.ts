import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/users/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./features/users/signup/signup.component').then(m => m.SignupComponent) },
  
  // User Routes
  { 
    path: 'home', 
    canActivate: [authGuard],
    loadComponent: () => import('./features/users/home/home.component').then(m => m.HomeComponent) 
  },

  // Admin Routes
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { role: 'ADMIN' }, // Protect with Admin role
    loadComponent: () => import('./features/admin/admin-user-management/admin-user-management.component').then(m => m.AdminUserManagementComponent),
    children: [
      {
        path: 'users',
        loadComponent: () => import('./features/admin/admin-user-management/user-list/user-list.component').then(m => m.UserListComponent)
      },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];