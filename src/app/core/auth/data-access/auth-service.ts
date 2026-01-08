import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterUserForm } from './auth.models';
import { HttpService } from '../../../shared/data-access/http-service';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #http = inject(HttpService);

  signUp = (request: RegisterUserForm): Observable<any> => {
    console.log('Registering user:', request);
    return this.#http.post('auth/register', request);
  };

  login = (email: string, password: string): Observable<any> => {
    return this.#http.post('auth/login', { email, password });
  };
}
