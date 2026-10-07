import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface Supplier {
  id: number;
  name: string;
  taxId?: string;
  contactName?: string;
  email?: string;
  phone?: string;
}

export interface PurchaseOrderItem {
  id?: number;
  productId: number;
  product?: any;
  quantity: number;
  unitCost: number;
  unit: string;
  receivedQty?: number;
}

export interface PurchaseOrder {
  id: number;
  code: string;
  supplierId: number;
  supplier?: Supplier;
  status: string;
  totalAmount: number;
  orderedAt?: string;
  expectedAt?: string;
  receivedAt?: string;
  items?: PurchaseOrderItem[];
}

@Injectable({ providedIn: 'root' })
export class PurchasingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/purchasing`;

  getSuppliers() {
    return this.http.get<ApiResponse<Supplier[]>>(`${this.apiUrl}/suppliers`)
      .pipe(map(r => r.data));
  }

  createSupplier(supplier: Partial<Supplier>) {
    return this.http.post<ApiResponse<Supplier>>(`${this.apiUrl}/suppliers`, supplier)
      .pipe(map(r => r.data));
  }

  getPurchaseOrders() {
    return this.http.get<ApiResponse<PurchaseOrder[]>>(`${this.apiUrl}/orders`)
      .pipe(map(r => r.data));
  }

  getPurchaseOrder(id: number) {
    return this.http.get<ApiResponse<PurchaseOrder>>(`${this.apiUrl}/orders/${id}`)
      .pipe(map(r => r.data));
  }

  createPurchaseOrder(order: any) {
    return this.http.post<ApiResponse<PurchaseOrder>>(`${this.apiUrl}/orders`, order)
      .pipe(map(r => r.data));
  }

  receivePurchaseOrder(id: number) {
    return this.http.post<ApiResponse<PurchaseOrder>>(`${this.apiUrl}/orders/${id}/receive`, {})
      .pipe(map(r => r.data));
  }
}
