import { inject } from '@angular/core';
import { AuthService } from './auth-service';
import { authState } from './auth.state';
import { catchError, of, switchMap, tap } from 'rxjs';

export const authInitializer = () => {
  const authService = inject(AuthService);

  if (!authService.isSessionActive()) {
    authState.markInitialized();
    return of(null);
  }

  return authService.refreshToken().pipe(
    switchMap((res) => {
      if (res?.success) {
        authState.setToken(res.data.accessToken);

        if (res.data.user) {
          authState.setUser(res.data.user);
          return of(res);
        } else {
          return authService.restoreSession().pipe(
            tap((userRes) => {
              if (userRes.success) {
                authState.setUser(userRes.data);
              }
            }),
            catchError((userErr) => {
              authService.clearSession();
              return of(null);
            })
          );
        }
      } else {
        return of(null);
      }
    }),
    tap(() => authState.markInitialized()),
    catchError((err) => {
      authService.clearSession();
      authState.markInitialized();
      return of(null);
    })
  );
};
