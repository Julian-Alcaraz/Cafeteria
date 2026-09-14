import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface AuditLog {
  id: number;
  userId: number;
  method: string;
  url: string;
  requestPayload: any;
  responsePayload: any;
  statusCode: number;
  isSuccess: boolean;
  executionTimeMs: number;
  createdAt: string;
}

export interface AuditLogResponse {
  code: number;
  message: string;
  data: {
    items: AuditLog[];
    total: number;
    skip: number;
    take: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/audit-logs`;

  getLogs(skip: number, take: number, method?: string, isSuccess?: string): Observable<AuditLogResponse> {
    let params = new HttpParams()
      .set('skip', skip.toString())
      .set('take', take.toString());
      
    if (method) {
      params = params.set('method', method);
    }
    if (isSuccess !== undefined && isSuccess !== null && isSuccess !== '') {
      params = params.set('isSuccess', isSuccess);
    }

    return this.http.get<AuditLogResponse>(this.apiUrl, { params });
  }
}
