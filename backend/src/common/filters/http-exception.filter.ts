import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      // Manejar el caso donde class-validator devuelve un array de mensajes
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

    response.status(status).json({
      code: status,
      message: message,
      data: null,
    });
  }
}
