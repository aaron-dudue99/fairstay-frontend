import { provideRouter } from '@angular/router';
import { Routes } from '@angular/router';
import { guestGuard } from './guards/guest-guard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'signup',
    canActivate: [guestGuard],
    loadComponent: () => import('./core/auth/feature-shell/signup/signup').then((m) => m.Signup),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./core/auth/feature-shell/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./libs/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'properties',
        loadComponent: () => import('./libs/properties/properties').then((m) => m.Properties),
      },
      {
        path: 'leases',
        loadComponent: () => import('./libs/leases/leases').then((m) => m.Leases),
      },
      {
        path: 'payments',
        loadComponent: () => import('./libs/payments/payments').then((m) => m.Payments),
      },
    ],
  },

  // {
  //   path: 'forgot-password',
  //   loadComponent: () =>
  //     import('./features/auth/feature-shell/forgot-password/forgot-password').then(
  //       (m) => m.ForgotPassword
  //     ),
  // },
];
