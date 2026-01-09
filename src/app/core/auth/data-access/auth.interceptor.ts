import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth-service';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { authState } from './auth.state';
import { Router } from '@angular/router';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const token = authState.token();
  let authReq = req;

  if (token && !req.url.includes('auth/refresh') && !req.url.includes('auth/login')) {
    authReq = addToken(req, token);
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !req.url.includes('auth/login') &&
        !req.url.includes('auth/refresh')
      ) {
        return handle401Error(authReq, next);
      }

      return throwError(() => error);
    })
  );
};

const handle401Error = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response) => {
        isRefreshing = false;
        authState.setToken(response.data.accessToken);
        authState.setUser(response.data.user);
        refreshTokenSubject.next(response.data.accessToken);
        return next(addToken(request, response.data.accessToken));
      }),
      catchError((error) => {
        isRefreshing = false;
        authState.clear();
        router.navigate(['/login']);
        return throwError(() => error);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token != null),
      take(1),
      switchMap((jwt) => {
        return next(addToken(request, jwt!));
      })
    );
  }
};

const addToken = (request: HttpRequest<unknown>, token: string) => {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
};
