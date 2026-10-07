import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Product } from '../catalogo/catalogo.service';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface HopperConfig {
  id: number;
  configDate: string;
  slotNumber: number;
  productId: number;
  product?: Product;
  configuredByUserId: number;
  configuredByUser?: any;
  isActive: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class HoppersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/hoppers`;

  getActiveConfigs() {
    return this.http.get<ApiResponse<HopperConfig[]>>(`${this.apiUrl}/active`)
      .pipe(map(r => r.data));
  }

  getHistory(slot: number) {
    return this.http.get<ApiResponse<HopperConfig[]>>(`${this.apiUrl}/${slot}/history`)
      .pipe(map(r => r.data));
  }

  setActiveConfig(slotNumber: number, productId: number) {
    return this.http.post<ApiResponse<HopperConfig>>(`${this.apiUrl}/active`, { slotNumber, productId })
      .pipe(map(r => r.data));
  }
}
