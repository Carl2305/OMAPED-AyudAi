import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';

export const RoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data?.['roles'] as Array<string>;

  if (!requiredRoles) {
    return true;
  }

  if (authService.hasAnyRole(requiredRoles)) {
    return true;
  } else {
    router.navigate(['/unauthorized']);
    return false;
  }
};
