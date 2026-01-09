import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { authState } from '../core/auth/data-access/auth.state';

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (!authState.initialized()) {
    return false;
  }

  if (authState.isAuthenticated()) {
    return router.createUrlTree(['/']);
  }

  return true;
};
