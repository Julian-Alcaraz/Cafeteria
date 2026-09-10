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
}
