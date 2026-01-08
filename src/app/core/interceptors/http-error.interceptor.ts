import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        error.error?.message || error.status === 0
          ? 'Network error. Please try again.'
          : 'Something went wrong';

      messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
      });

      return throwError(() => error);
    })
  );
};
