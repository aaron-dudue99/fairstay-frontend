import { inject } from '@angular/core';
import { AuthService } from './auth-service';
import { AuthStore } from './auth.store';
import { catchError, of, switchMap, tap } from 'rxjs';
import { LoginResponse, User } from './auth.models';

export const authInitializer = () => {
  const authService = inject(AuthService);
  const authStore = inject(AuthStore);

  if (!authService.isSessionActive()) {
    authStore.markInitialized();
    return of(null);
  }

  return authService.refreshToken().pipe(
    switchMap((res) => {
      if (res?.success) {
        const data = res.data as LoginResponse;
        authStore.setAccessToken(data.accessToken);

        if (data.user) {
          authStore.setUser(data.user);
          return of(res);
        } else {
          return authService.restoreSession().pipe(
            tap((userRes) => {
              if (userRes.success) {
                const user = userRes.data as User;
                authStore.setUser(user);
              }
            }),
            catchError(() => {
              authStore.clearAuth();
              authService.clearSession();
              return of(null);
            })
          );
        }
      } else {
        return of(null);
      }
    }),
    tap(() => authStore.markInitialized()),
    catchError(() => {
      authStore.clearAuth();
      authService.clearSession();
      authStore.markInitialized();
      return of(null);
    })
  );
};
