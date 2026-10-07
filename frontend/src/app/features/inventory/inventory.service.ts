import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface Stock {
  id: number;
  productId: number;
  product?: any;
  quantityAvailable: number;
  quantityReserved: number;
  unit: string;
}

export interface StockMovement {
  id: number;
  productId: number;
  type: string;
  quantity: number;
  unitCost?: number;
  referenceType: string;
  referenceId?: number;
  performedByUserId: number;
  performedByUser?: any;
  notes?: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/inventory`;

  getGlobalStock() {
    return this.http.get<ApiResponse<Stock[]>>(`${this.apiUrl}/stock`)
      .pipe(map(r => r.data));
  }

  getProductMovements(productId: number) {
    return this.http.get<ApiResponse<StockMovement[]>>(`${this.apiUrl}/products/${productId}/movements`)
      .pipe(map(r => r.data));
  }
}
