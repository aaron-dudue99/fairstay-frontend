import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  readonly http = inject(HttpClient);
  private readonly API_BASE_URL = 'http://localhost:8080/api/';
  private readonly DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  get<T>(path: string, headers?: HttpHeaders): Observable<T> {
    return this.http
      .get<T>(`${this.API_BASE_URL}${path}`, { headers: headers ?? this.DEFAULT_HEADERS })
      .pipe(catchError(this.handleError));
  }

  post<T>(path: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http
      .post<T>(`${this.API_BASE_URL}${path}`, body, { headers: headers ?? this.DEFAULT_HEADERS })
      .pipe(catchError(this.handleError));
  }

  put<T>(path: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http
      .put<T>(`${this.API_BASE_URL}${path}`, body, { headers: headers ?? this.DEFAULT_HEADERS })
      .pipe(catchError(this.handleError));
  }

  patch<T>(path: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http
      .patch<T>(`${this.API_BASE_URL}${path}`, body, { headers: headers ?? this.DEFAULT_HEADERS })
      .pipe(catchError(this.handleError));
  }

  delete<T>(path: string, headers?: HttpHeaders): Observable<T> {
    return this.http
      .delete<T>(`${this.API_BASE_URL}${path}`, { headers: headers ?? this.DEFAULT_HEADERS })
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
