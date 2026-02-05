import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../core/auth/data-access/auth.store';

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  if (!authStore.initialized()) {
    return false;
  }

  if (authStore.isAuthenticated()) {
    return router.createUrlTree(['/']);
  }

  return true;
};
