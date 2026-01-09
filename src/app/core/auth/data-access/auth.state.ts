import { computed, signal } from '@angular/core';
import { User } from './auth.models';

const user = signal<User | null>(null);
const initialized = signal<boolean>(false);
const token = signal<string | null>(null);

export const authState = {
  user,
  token,
  initialized,

  isAuthenticated: computed(() => !!user()),
  setUser: (u: User) => user.set(u),
  setToken: (t: string) => token.set(t),
  clear: () => {
    user.set(null);
    token.set(null);
  },

  markInitialized: () => initialized.set(true),
};
