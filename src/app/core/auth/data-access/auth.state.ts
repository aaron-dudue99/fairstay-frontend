import { signal } from '@angular/core';
import { User } from './auth.models';

class AuthState {
  private _user = signal<User | null>(null);
  user = this._user.asReadonly();

  setUser(user: User | null) {
    this._user.set(user);
  }

  clearUser() {
    this._user.set(null);
  }

  isAuthenticated() {
    return this._user() !== null;
  }
}

export const authState = new AuthState();
