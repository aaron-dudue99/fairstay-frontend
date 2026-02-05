import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { AuthService } from '../../data-access/auth-service';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { passwordMatchValidator } from '../../../../utils/password-match.validator';
import { take } from 'rxjs/internal/operators/take';
import { RegisterUserForm } from '../../data-access/auth.models';
import { AuthFacade } from '../../data-access/auth.facade';

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    SelectModule,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  readonly #fb = inject(FormBuilder);
  readonly #authService = inject(AuthService);
  readonly #authFacade = inject(AuthFacade);
  readonly #router = inject(Router);
  readonly #messageService = inject(MessageService);

  loading = signal(false);

  signupForm = this.#fb.nonNullable.group(
    {
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator() }
  );

  roles = [
    { label: 'Tenant', value: 'TENANT' },
    { label: 'Landlord', value: 'LANDLORD' },
  ];

  #signupInProgress = signal(false);

  constructor() {
    effect(() => {
      const status = this.#authFacade.status();
      const user = this.#authFacade.user();

      if (!this.#signupInProgress()) return;

      if (status === 'authenticated' && user) {
        this.#messageService.add({
          severity: 'success',
          summary: 'Account created',
          detail: 'Welcome to Fairstay 🎉',
          life: 2500,
        });

        this.#router.navigate(['']);
        this.#signupInProgress.set(false);
      }
    });
  }

  onSignUp() {
    if (this.loading()) return;

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const { confirmPassword, ...signupPayload } = this.signupForm.getRawValue();

    this.#authService
      .signUp(signupPayload as RegisterUserForm)
      .pipe(take(1))
      .subscribe({
        next: () => this.autoLogin(signupPayload.email!, signupPayload.password!),
        error: () => this.loading.set(false),
        complete: () => this.loading.set(false),
      });
  }

  private autoLogin(email: string, password: string) {
    this.#signupInProgress.set(true);
    this.#authFacade.login({ email, password });
  }
}
