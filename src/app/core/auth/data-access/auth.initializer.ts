import { inject } from '@angular/core';
import { AuthService } from './auth-service';
import { AuthFacade } from './auth.facade';
import { catchError, of, switchMap, tap } from 'rxjs';
import { LoginResponse, User } from './auth.models';

export const authInitializer = () => {
  const authService = inject(AuthService);
  const authFacade = inject(AuthFacade);

  if (!authService.isSessionActive()) {
    authFacade.markInitialized();
    return of(null);
  }

  return authService.refreshToken().pipe(
    switchMap((res) => {
      if (res?.success) {
        const data = res.data as LoginResponse;
        authFacade.setAccessToken(data.accessToken);

        if (data.user) {
          authFacade.setUser(data.user);
          return of(res);
        } else {
          return authService.restoreSession().pipe(
            tap((userRes) => {
              if (userRes.success) {
                const user = userRes.data as User;
                authFacade.setUser(user);
              }
            }),
            catchError(() => {
              authFacade.clearAuth();
              authService.clearSession();
              return of(null);
            })
          );
        }
      } else {
        return of(null);
      }
    }),
    tap(() => authFacade.markInitialized()),
    catchError(() => {
      authFacade.clearAuth();
      authService.clearSession();
      authFacade.markInitialized();
      return of(null);
    })
  );
};
