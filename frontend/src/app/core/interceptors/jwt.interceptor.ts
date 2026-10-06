import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@shared/components/toast/toast.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  const session = authService.session();

  if (session && session.token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${session.token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        toastService.add({
          severity: 'error',
          summary: 'Sesión expirada',
          detail: 'Tu sesión ha expirado o el token es inválido. Por favor, inicia sesión nuevamente.'
        });
        authService.logout();
      } else if (error.status === 403) {
        toastService.add({
          severity: 'error',
          summary: 'Acceso Denegado',
          detail: 'No tienes permisos suficientes para realizar esta acción.'
        });
      }
      return throwError(() => error);
    })
  );
};

