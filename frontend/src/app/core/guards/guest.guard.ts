import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.session()) {
    const menus = authService.session()?.menus;
    const firstUrl = authService.getFirstAvailableUrl(menus);
    if (firstUrl) {
      return router.createUrlTree([firstUrl]);
    }
    return router.createUrlTree(['/app/no-access']);
  }

  return true;
};
