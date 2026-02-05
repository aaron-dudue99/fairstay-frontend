import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFacade } from '../core/auth/data-access/auth.facade';

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authFacade = inject(AuthFacade);

  if (!authFacade.initialized()) {
    return false;
  }

  if (authFacade.isAuthenticated()) {
    return router.createUrlTree(['/']);
  }

  return true;
};
