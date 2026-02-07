import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../shared/models/api-response.model';
import { LoginResponse, SignUpResponse } from '../../shared/models/auth.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  private readonly API_URL = `${environment.apiUrl}/auth/users`;
  private http = inject(HttpClient);
  // private readonly API_URL = 'http://localhost:8080/user-management/api/v1/auth/users';

  currentUser = signal<LoginResponse | null>(null);

  getUserProfile(): Observable<ApiResponse<LoginResponse>> {
    return this.http.get<ApiResponse<LoginResponse>>(`${this.API_URL}/me`, {
      withCredentials: true // Required to send the HttpOnly cookies back to the server
    }).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.currentUser.set(res.data);
        }
      })
    );
  }

  login(credentials: any): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.API_URL}/login`, credentials, {
      withCredentials: true 
    }).pipe(
      tap(res => {
        if (res.success && res.data) this.currentUser.set(res.data);
      })
    );
  }

  signup(userData: any): Observable<ApiResponse<SignUpResponse>> {
    return this.http.post<ApiResponse<SignUpResponse>>(`${this.API_URL}/signup`, userData, {
      withCredentials: true
    });
  }

  refreshToken(): Observable<ApiResponse<any>> {
  return this.http.post<ApiResponse<any>>(`${this.API_URL}/refresh`, {}, {
    withCredentials: true
    });
  }

  logout() {
    this.currentUser.set(null);
  }
}