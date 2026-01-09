import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { authState } from '../core/auth/data-access/auth.state';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (!authState.initialized()) {
    return false;
  }

  return authState.isAuthenticated() ? true : router.createUrlTree(['/login']);
};
