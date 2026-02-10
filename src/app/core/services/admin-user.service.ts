import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedApiResponse, PaginationRequest } from '../../shared/models/api-response.model';
import { environment } from '../../../environments/environment.prod';
import { localEnvironment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {

  private readonly API_URL = `${localEnvironment.apiUrl}/admin/userManagement`;
  private http = inject(HttpClient);

  getUsers(params: any): Observable<PaginatedApiResponse<any>> {
    let httpParams = new HttpParams()
        .set('page', params.page.toString())
        .set('size', params.size.toString())
        .set('sortBy', params.sortBy)
        .set('sortDir', params.sortDir)
        .set('includeAdmins', params.includeAdmins.toString())
        .set('includeBanUsers', params.includeBanUsers.toString());

    if (params.keyword) {
        httpParams = httpParams.set('keyword', params.keyword);
    }

    return this.http.get<PaginatedApiResponse<any>>(this.API_URL, { 
        params: httpParams, 
        withCredentials: true 
    });
  } 

  getUserById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/${id}`, { 
      withCredentials: true 
    });
  }

  createUser(request: any): Observable<ApiResponse<any>> {
  return this.http.post<ApiResponse<any>>(this.API_URL, request, {
    withCredentials: true
  });
  }

  updateUser(userId: number, request: any): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.API_URL}/${userId}`, request, {
      withCredentials: true
    });
  }

  banUser(userId: number, reason: string): Observable<ApiResponse<any>> {
    const params = new HttpParams().set('desc', reason);
    return this.http.patch<ApiResponse<any>>(`${this.API_URL}/ban/${userId}`, null, {
      params,
      withCredentials: true
    });
  }

  reactiveUser(userId: number): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.API_URL}/reactivate/${userId}`, null, {
      withCredentials: true
    });
  }
}