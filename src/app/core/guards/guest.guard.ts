// src/app/core/guards/guest.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';

/**
 * Guard que permite acceso solo a usuarios no autenticados
 * Útil para páginas de login, registro, etc.
 * Si el usuario ya está autenticado, lo redirige a /home
 */
export const GuestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el usuario está autenticado, redirigir al home
  if (authService.isAuthenticated()) {
    const returnUrl = route.queryParams?.['returnUrl'] || '/home';
    router.navigate([returnUrl]);
    return false;
  }

  // Si no está autenticado, permite el acceso
  return true;
};
