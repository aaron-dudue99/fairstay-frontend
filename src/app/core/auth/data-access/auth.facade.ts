import { inject, Injectable } from '@angular/core';
import { AuthStore } from './auth.store';
import { LoginResponse, User } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  readonly #authStore = inject(AuthStore);

  readonly user = this.#authStore.user;
  readonly accessToken = this.#authStore.accessToken;
  readonly status = this.#authStore.status;
  readonly error = this.#authStore.error;
  readonly isAuthenticated = this.#authStore.isAuthenticated;
  readonly isLandlord = this.#authStore.isLandlord;
  readonly isTenant = this.#authStore.isTenant;

  readonly initialized = this.#authStore.initialized;

  login(payload: { email: string; password: string }) {
    this.#authStore.login(payload);
  }

  logout() {
    this.#authStore.logout();
  }

  initialize() {
    this.#authStore.restoreSession();
  }

  refreshToken() {
    return this.#authStore.refreshToken();
  }
  
  // Methods used by interceptors/initializers
  setUser(user: User) {
    this.#authStore.setUser(user);
  }

  setAccessToken(token: string) {
    this.#authStore.setAccessToken(token);
  }

  clearAuth() {
    this.#authStore.clearAuth();
  }

  markInitialized() {
    this.#authStore.markInitialized();
  }
}
