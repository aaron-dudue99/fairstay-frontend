import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFacade } from '../core/auth/data-access/auth.facade';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authFacade = inject(AuthFacade);

  if (!authFacade.initialized()) {
    return false;
  }

  return authFacade.isAuthenticated() ? true : router.createUrlTree(['/login']);
};
