import { ApplicationConfig } from '@angular/core';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/data-access/auth.interceptor';
import { authInitializer } from './core/auth/data-access/auth.initializer';
import { provideAppInitializer } from '@angular/core';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideRouter } from '@angular/router';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi(), withInterceptors([authInterceptor])),
    provideAppInitializer(authInitializer),
    providePrimeNG({ theme: { preset: Aura }, ripple: true }),
    MessageService,
  ],
};
