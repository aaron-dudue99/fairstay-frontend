import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthStore } from '../../data-access/auth.store';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    PasswordModule,
    RouterLink,
    ToastModule,
  ],
  templateUrl: './login.html',
})
export class Login {
  readonly #fb = inject(FormBuilder);
  readonly #authStore = inject(AuthStore);
  readonly #router = inject(Router);
  readonly #messageService = inject(MessageService);

  loading = signal(false);

  loginForm = this.#fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  constructor() {
    effect(() => {
      const status = this.#authStore.status();
      const user = this.#authStore.user();
      const error = this.#authStore.error();

      if (status === 'loading') {
        this.loading.set(true);
        return;
      }

      this.loading.set(false);

      if (status === 'authenticated' && user) {
        this.#messageService.add({
          severity: 'success',
          summary: 'Login successful',
          detail: `Welcome back, ${user.fullName}`,
          life: 2000,
        });

        this.#router.navigate(['']);
      }

      if (status === 'error' && error) {
        this.#messageService.add({
          severity: 'error',
          summary: 'Login failed',
          detail: error,
          life: 3000,
        });
      }
    });
  }

  onLogin(): void {
    if (this.loading()) return;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    this.#authStore.login({ email: email!, password: password! });
  }
}
