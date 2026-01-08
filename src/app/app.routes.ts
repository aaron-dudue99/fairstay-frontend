import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layout/main-layout/main-layout').then((m) => m.MainLayout),
  },
  {
    path: 'signup',
    loadComponent: () => import('./core/auth/feature-shell/signup/signup').then((m) => m.Signup),
  },
  {
    path: 'login',
    loadComponent: () => import('./core/auth/feature-shell/login/login').then((m) => m.Login),
  },
  // {
  //   path: 'forgot-password',
  //   loadComponent: () =>
  //     import('./features/auth/feature-shell/forgot-password/forgot-password').then(
  //       (m) => m.ForgotPassword
  //     ),
  // },
];
