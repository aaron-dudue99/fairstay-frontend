import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { AuthService } from './auth-service';
import { AuthState, LoginResponse, User } from './auth.models';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: 'idle',
  error: null,
  initialized: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withDevtools('auth'),

  withState<AuthState>(initialState),

  withComputed((store) => ({
    isAuthenticated: computed(() => store.status() === 'authenticated'),

    role: computed(() => store.user()?.role ?? null),

    userId: computed(() => store.user()?.id ?? null),

    isLandlord: computed(() => store.user()?.role === 'LANDLORD'),

    isTenant: computed(() => store.user()?.role === 'TENANT'),
  })),

  withMethods((store) => {
    const authService = inject(AuthService);

    function setAuthSuccess(payload: LoginResponse) {
      patchState(store, {
        user: payload.user,
        accessToken: payload.accessToken,
        status: 'authenticated',
        error: null,
      });
    }

    function setUser(user: User) {
      patchState(store, {
        user,
        status: 'authenticated',
        error: null,
      });
    }

    function clearAuth() {
      patchState(store, {
        user: null,
        accessToken: null,
        status: 'idle',
        error: null,
      });
    }

    function markInitialized() {
      patchState(store, { initialized: true });
    }

    return {
      markInitialized,

      setAccessToken: (accessToken: string) => {
        patchState(store, { accessToken, status: 'authenticated' });
      },

      setUser,

      clearAuth,

      login: rxMethod<{ email: string; password: string }>(
        pipe(
          tap(() => {
            patchState(store, {
              status: 'loading',
              error: null,
            });
          }),
          switchMap(({ email, password }) =>
            authService.login(email, password).pipe(
              tap((res) => {
                const data = res.data as LoginResponse;
                setAuthSuccess(data);
                authService.setSessionActive();
              }),
              catchError((err) => {
                patchState(store, {
                  status: 'error',
                  error: err?.error?.message || err?.message || 'Login failed',
                });
                return of(null);
              })
            )
          )
        )
      ),

      restoreSession: rxMethod<void>(
        pipe(
          tap(() => {
            patchState(store, {
              status: 'loading',
              error: null,
            });
          }),
          switchMap(() =>
            authService.restoreSession().pipe(
              tap((res) => {
                const user = res.data as User;
                setUser(user);
              }),
              catchError(() => {
                clearAuth();
                return of(null);
              })
            )
          )
        )
      ),

      refreshToken: rxMethod<void>(
        pipe(
          switchMap(() =>
            authService.refreshToken().pipe(
              tap((res) => {
                const data = res.data as LoginResponse;
                patchState(store, {
                  accessToken: data.accessToken,
                  status: 'authenticated',
                });

                if (data.user) {
                  patchState(store, { user: data.user });
                }
              }),
              catchError(() => {
                clearAuth();
                authService.clearSession();
                return of(null);
              })
            )
          )
        )
      ),

      logout: rxMethod<void>(
        pipe(
          tap(() => {
            patchState(store, { status: 'loading' });
            authService.clearSession();
          }),
          switchMap(() =>
            authService.logout().pipe(
              tap(() => {
                clearAuth();
              }),
              catchError(() => {
                clearAuth();
                return of(null);
              })
            )
          )
        )
      ),
    };
  })
);
