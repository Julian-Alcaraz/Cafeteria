import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { map } from 'rxjs';

export interface AuditIgnoreRule {
  id: number;
  routePattern: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuditoriaConfigService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/audit-ignore-rules`;

  getRules() {
    return this.http.get<{code: number, data: AuditIgnoreRule[]}>(this.apiUrl)
      .pipe(map(res => res.data));
  }

  createRule(rule: Partial<AuditIgnoreRule>) {
    return this.http.post<{code: number, data: AuditIgnoreRule}>(this.apiUrl, rule)
      .pipe(map(res => res.data));
  }

  updateRule(id: number, rule: Partial<AuditIgnoreRule>) {
    return this.http.patch<{code: number, data: AuditIgnoreRule}>(`${this.apiUrl}/${id}`, rule)
      .pipe(map(res => res.data));
  }

  deleteRule(id: number) {
    return this.http.delete<{code: number, data: any}>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }
}
