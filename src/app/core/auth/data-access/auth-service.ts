import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterUserForm } from './auth.models';
import { HttpService } from '../../../shared/data-access/http-service';
import { ApiResponse } from '../../../shared/data-access/api-config';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #http = inject(HttpService);
  readonly #httpClient = inject(HttpClient);
  readonly #platformId = inject(PLATFORM_ID);
  readonly #API_BASE_URL = 'http://localhost:8080/api/';
  readonly #LOGGED_IN_KEY = 'valid_session';

  signUp(request: RegisterUserForm): Observable<ApiResponse> {
    return this.#http.post('auth/register', request);
  }

  login(email: string, password: string): Observable<ApiResponse> {
    return this.#httpClient.post<ApiResponse>(
      `${this.#API_BASE_URL}auth/login`,
      { email, password },
      { withCredentials: true }
    );
  }

  logout(): Observable<ApiResponse> {
    return this.#httpClient.post<ApiResponse>(
      `${this.#API_BASE_URL}auth/logout`,
      {},
      { withCredentials: true }
    );
  }

  refreshToken(): Observable<ApiResponse> {
    return this.#httpClient.post<ApiResponse>(
      `${this.#API_BASE_URL}auth/refresh`,
      {},
      { withCredentials: true }
    );
  }

  restoreSession(): Observable<ApiResponse> {
    return this.#http.get<ApiResponse>('users/me');
  }

  setSessionActive(): void {
    if (isPlatformBrowser(this.#platformId)) {
      localStorage.setItem(this.#LOGGED_IN_KEY, 'true');
    }
  }

  clearSession(): void {
    if (isPlatformBrowser(this.#platformId)) {
      localStorage.removeItem(this.#LOGGED_IN_KEY);
    }
  }

  isSessionActive(): boolean {
    if (isPlatformBrowser(this.#platformId)) {
      return localStorage.getItem(this.#LOGGED_IN_KEY) === 'true';
    }
    return false;
  }
}
