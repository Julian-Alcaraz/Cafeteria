import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export interface ApiResponse<T> { data: T; message?: string; }

export interface PosAccount {
  id: number;
  customerName?: string;
  tableId?: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  totalAmount: number;
  paymentMethodInfo?: string;
  tip: number;
  items: PosAccountItem[];
  user?: { id: number; username: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface PosAccountItem {
  id: number;
  accountId: number;
  productId: number;
  quantity: number;
  price: number;
  status: 'PENDING' | 'DELIVERED' | 'CANCELLED';
  isComplimentary: boolean;
  complimentaryReason?: string;
  remadeQuantity: number;
  hopperId?: number;
  product?: any;
}

@Injectable({ providedIn: 'root' })
export class PosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pos`;

  getOpenAccounts(): Observable<PosAccount[]> {
    return this.http.get<ApiResponse<PosAccount[]>>(`${this.apiUrl}/accounts`).pipe(map(r => r.data));
  }

  getAccountById(id: number): Observable<PosAccount> {
    return this.http.get<ApiResponse<PosAccount>>(`${this.apiUrl}/accounts/${id}`).pipe(map(r => r.data));
  }

  openAccount(dto: { customerName?: string; tableId?: number }): Observable<PosAccount> {
    return this.http.post<ApiResponse<PosAccount>>(`${this.apiUrl}/accounts`, dto).pipe(map(r => r.data));
  }

  addItem(accountId: number, dto: { productId: number; quantity: number; price: number; hopperId?: number }): Observable<PosAccountItem> {
    return this.http.post<ApiResponse<PosAccountItem>>(`${this.apiUrl}/accounts/${accountId}/items`, dto).pipe(map(r => r.data));
  }

  removeItem(itemId: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/items/${itemId}`).pipe(map(r => r.data));
  }

  deliverItem(itemId: number): Observable<PosAccountItem> {
    return this.http.patch<ApiResponse<PosAccountItem>>(`${this.apiUrl}/items/${itemId}/deliver`, {}).pipe(map(r => r.data));
  }

  remakeItem(itemId: number, reason?: string): Observable<PosAccountItem> {
    return this.http.patch<ApiResponse<PosAccountItem>>(`${this.apiUrl}/items/${itemId}/remake`, { reason }).pipe(map(r => r.data));
  }

  closeAccount(accountId: number, dto: { paymentMethodInfo?: string; tip?: number }): Observable<PosAccount> {
    return this.http.patch<ApiResponse<PosAccount>>(`${this.apiUrl}/accounts/${accountId}/close`, dto).pipe(map(r => r.data));
  }
}
