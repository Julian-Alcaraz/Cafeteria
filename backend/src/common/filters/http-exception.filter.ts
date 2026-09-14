import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuditService } from '../../modules/audit/audit.service.js';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly auditService?: AuditService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { user?: any }>();
    const method = request.method;
    const now = Date.now();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        if ('message' in exceptionResponse) {
           const msg = (exceptionResponse as any).message;
           message = Array.isArray(msg) ? msg.join(', ') : msg;
        } else {
           message = JSON.stringify(exceptionResponse);
        }
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse = {
      code: status,
      message: message,
      data: null,
    };

    // Auditar error asíncronamente si es modificación
    if (this.auditService && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      this.auditService.createLogAsync({
        userId: request.user?.id || null,
        method,
        url: request.url,
        requestPayload: request.body,
        responsePayload: errorResponse,
        statusCode: status,
        isSuccess: false,
        executionTimeMs: Date.now() - now, // Approximate if error thrown fast
      });
    }

    response.status(status).json(errorResponse);
  }
}
