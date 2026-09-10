import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface User {
  id: number;
  username: string;
  permissions: Permission[];
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getUsuarios() {
    return this.http.get<ApiResponse<User[]>>(this.apiUrl).pipe(map(res => res.data));
  }

  createUsuario(data: any) {
    return this.http.post<ApiResponse<User>>(this.apiUrl, data).pipe(map(res => res.data));
  }

  updateUsuario(id: number, data: any) {
    return this.http.patch<ApiResponse<User>>(`${this.apiUrl}/${id}`, data).pipe(map(res => res.data));
  }

  deleteUsuario(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(map(res => res.data));
  }
}
