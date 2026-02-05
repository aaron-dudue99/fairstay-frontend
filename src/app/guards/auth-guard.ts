import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../core/auth/data-access/auth.store';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  if (!authStore.initialized()) {
    return false;
  }

  return authStore.isAuthenticated() ? true : router.createUrlTree(['/login']);
};
