import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, switchMap, catchError, tap } from 'rxjs';

import { AuthFacade } from './auth.facade';
import { AuthService } from './auth-service';
import { LoginResponse } from './auth.models';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authFacade = inject(AuthFacade);
  const authService = inject(AuthService);

  let authReq = req;

  const token = authFacade.accessToken();

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      // Skip refresh for auth endpoints to avoid infinite loop
      if (req.url.includes('/auth/')) {
        return throwError(() => error);
      }

      return authService.refreshToken().pipe(
        tap((res) => {
          const data = res.data as LoginResponse;
          authFacade.setAccessToken(data.accessToken);

          if (data.user) {
            authFacade.setUser(data.user);
          }
        }),
        switchMap((res) => {
          const accessToken = res.data.accessToken;

          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          });

          return next(retryReq);
        }),
        catchError(() => {
          authFacade.clearAuth();
          authService.clearSession();
          return throwError(() => error);
        })
      );
    })
  );
};
