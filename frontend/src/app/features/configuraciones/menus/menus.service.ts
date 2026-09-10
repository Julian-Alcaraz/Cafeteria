import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

export interface Menu {
  id: number;
  label: string;
  icon?: string;
  url?: string;
  parent_id?: number;
  requiredPermission?: { id: number; name: string };
  children?: Menu[];
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class MenusService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/menus`;

  getMenus() {
    return this.http.get<ApiResponse<Menu[]>>(this.apiUrl).pipe(map(res => res.data));
  }

  createMenu(data: any) {
    return this.http.post<ApiResponse<Menu>>(this.apiUrl, data).pipe(map(res => res.data));
  }

  updateMenu(id: number, data: any) {
    return this.http.patch<ApiResponse<Menu>>(`${this.apiUrl}/${id}`, data).pipe(map(res => res.data));
  }

  deleteMenu(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(map(res => res.data));
  }
}
