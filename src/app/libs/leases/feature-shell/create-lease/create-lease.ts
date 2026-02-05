import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { Textarea } from 'primeng/textarea';
import { LeasesFacade } from '../../data-access/leases.facade';

@Component({
  selector: 'app-create-lease',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ButtonModule, 
    InputTextModule, 
    InputNumberModule, 
    DatePicker,
    Textarea
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-6 p-2">
      <div class="grid grid-cols-2 gap-6">
        <div class="flex flex-col gap-2">
          <label for="unitId" class="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Unit ID</label>
          <input 
            pInputText 
            id="unitId" 
            formControlName="unitId" 
            placeholder="Unit-101" 
            class="!rounded-xl !bg-white/5 !border-white/10 focus:!border-primary/50 transition-all" />
        </div>
        
        <div class="flex flex-col gap-2">
          <label for="tenantId" class="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Tenant ID</label>
          <input 
            pInputText 
            id="tenantId" 
            formControlName="tenantId" 
            placeholder="tenant@example.com" 
            class="!rounded-xl !bg-white/5 !border-white/10 focus:!border-primary/50 transition-all" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="flex flex-col gap-2">
          <label for="startDate" class="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Start Date</label>
          <p-datepicker 
            id="startDate" 
            formControlName="startDate" 
            appendTo="body"
            styleClass="w-full"
            inputStyleClass="!rounded-xl !bg-white/5 !border-white/10 focus:!border-primary/50 transition-all">
          </p-datepicker>
        </div>
        
        <div class="flex flex-col gap-2">
          <label for="endDate" class="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">End Date</label>
          <p-datepicker 
            id="endDate" 
            formControlName="endDate" 
            appendTo="body"
            styleClass="w-full"
            inputStyleClass="!rounded-xl !bg-white/5 !border-white/10 focus:!border-primary/50 transition-all">
          </p-datepicker>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="flex flex-col gap-2">
          <label for="monthlyRent" class="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Monthly Rent</label>
          <p-inputNumber 
            id="monthlyRent" 
            formControlName="monthlyRent" 
            mode="currency" 
            currency="USD" 
            locale="en-US"
            styleClass="w-full"
            inputStyleClass="!rounded-xl !bg-white/5 !border-white/10 focus:!border-primary/50 transition-all font-mono">
          </p-inputNumber>
        </div>
        
        <div class="flex flex-col gap-2">
          <label for="depositAmount" class="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Security Deposit</label>
          <p-inputNumber 
            id="depositAmount" 
            formControlName="depositAmount" 
            mode="currency" 
            currency="USD" 
            locale="en-US"
            styleClass="w-full"
            inputStyleClass="!rounded-xl !bg-white/5 !border-white/10 focus:!border-primary/50 transition-all font-mono">
          </p-inputNumber>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label for="terms" class="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Terms & Conditions</label>
        <textarea 
          pTextarea 
          id="terms" 
          formControlName="termsText" 
          rows="5" 
          class="!rounded-xl !bg-white/5 !border-white/10 focus:!border-primary/50 transition-all !w-full text-sm scrollbar-thin">
        </textarea>
      </div>

      <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
        <button 
          type="button"
          (click)="cancelled.emit()"
          class="px-5 py-2.5 rounded-xl text-gray-400 font-bold hover:bg-white/5 transition-all text-sm">
          Cancel
        </button>
        <button 
          type="submit" 
          [disabled]="form.invalid || (isBusy())"
          class="px-6 py-2.5 rounded-xl bg-primary text-primary-contrast font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none text-sm">
          <i class="pi pi-check" *ngIf="!(isBusy())"></i>
          <i class="pi pi-spin pi-spinner" *ngIf="(isBusy())"></i>
          <span>Create Lease Agreement</span>
        </button>
      </div>
    </form>
  `
})
export class CreateLease {
  @Output() cancelled = new EventEmitter<void>();
  
  readonly #fb = inject(FormBuilder);
  readonly #leasesFacade = inject(LeasesFacade);
  
  isBusy = this.#leasesFacade.isBusy;

  form = this.#fb.group({
    unitId: ['', Validators.required],
    tenantId: ['', Validators.required],
    startDate: [null as Date | null, Validators.required],
    endDate: [null as Date | null, Validators.required],
    monthlyRent: [0, [Validators.required, Validators.min(0)]],
    depositAmount: [0, [Validators.required, Validators.min(0)]],
    currency: ['USD', Validators.required],
    termsText: ['', Validators.required]
  });

  onSubmit() {
    if (this.form.invalid) return;

    const val = this.form.value;
    
    this.#leasesFacade.createLease({
      leaseRequestDto: {
        unitId: val.unitId!,
        tenantId: val.tenantId!,
        startDate: val.startDate!,
        endDate: val.endDate!,
        monthlyRent: val.monthlyRent!,
        depositAmount: val.depositAmount!,
        currency: val.currency!
      },
      termsText: val.termsText!
    });
    
    this.cancelled.emit();
  }
}
