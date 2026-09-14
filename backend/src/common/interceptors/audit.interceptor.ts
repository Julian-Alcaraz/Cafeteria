import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../../modules/audit/audit.service.js';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const method = request.method;

    // Solo auditar modificaciones (POST, PUT, PATCH, DELETE)
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const now = Date.now();
    const url = request.url;
    const body = request.body;
    const userId = request.user?.id || null;

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = ctx.getResponse();
          this.auditService.createLogAsync({
            userId,
            method,
            url,
            requestPayload: body,
            responsePayload: data || null,
            statusCode: response.statusCode,
            isSuccess: true,
            executionTimeMs: Date.now() - now,
          });
        },
        // Los errores serán manejados por el AllExceptionsFilter
      }),
    );
  }
}
