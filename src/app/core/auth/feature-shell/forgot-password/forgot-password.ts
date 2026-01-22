import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonModule, InputTextModule],
    template: `
    <div class="flex min-h-screen items-center justify-center p-4 bg-surface-ground relative overflow-hidden">
      
      <!-- Background Blur Elements -->
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <!-- Content -->
      <div class="glass p-8 rounded-3xl w-full max-w-md relative z-10 flex flex-col items-center">
          
          <!-- Logo -->
          <div class="mb-6">
              <img src="images/logo.png" alt="FairStay Logo" class="w-16 h-16 object-contain" />
          </div>

          <!-- Header -->
          <div class="text-center mb-8">
              <h1 class="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
              <p class="text-gray-400 text-sm">Enter your email and we'll send you a reset link</p>
          </div>

          <!-- Form -->
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="w-full flex flex-col gap-5">
              
              <div class="flex flex-col gap-2">
                  <label for="email" class="text-sm font-medium text-gray-300">Email Address</label>
                  <input 
                      id="email" 
                      type="email" 
                      pInputText 
                      formControlName="email" 
                      placeholder="you@example.com"
                      class="w-full bg-surface-card border-surface-border text-white placeholder:text-gray-500 rounded-xl py-3 px-4 focus:border-primary focus:ring-0"
                  />
              </div>

              <button
                  pButton
                  type="submit"
                  class="w-full py-3 rounded-xl bg-primary text-primary-contrast font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-2"
                  [disabled]="loading()"
              >
                  @if (loading()) {
                      <i class="pi pi-spin pi-spinner"></i>
                      <span>Sending Link...</span>
                  } @else {
                      <span>Send Reset Link</span>
                  }
              </button>

          </form>

          <!-- Footer -->
          <div class="mt-8 text-center">
              <a routerLink="/login" class="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                  <i class="pi pi-arrow-left text-xs"></i>
                  Back to Login
              </a>
          </div>
      </div>
    </div>
  `
})
export class ForgotPassword {
    private readonly fb = inject(FormBuilder);
    loading = signal(false);

    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
    });

    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading.set(true);
        // Simulate API call
        setTimeout(() => {
            this.loading.set(false);
            // Show success message or navigate
        }, 2000);
    }
}
