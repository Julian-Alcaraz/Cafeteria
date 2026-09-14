import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class PermisosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/permissions`;

  getPermisos() {
    return this.http.get<ApiResponse<Permission[]>>(this.apiUrl).pipe(map(res => res.data));
  }

  createPermiso(data: any) {
    return this.http.post<ApiResponse<Permission>>(this.apiUrl, data).pipe(map(res => res.data));
  }

  updatePermiso(id: number, data: any) {
    return this.http.patch<ApiResponse<Permission>>(`${this.apiUrl}/${id}`, data).pipe(map(res => res.data));
  }

  deletePermiso(id: number) {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(map(res => res.data));
  }
}
