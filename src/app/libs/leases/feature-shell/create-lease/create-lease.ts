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
    Textarea,
  ],
  templateUrl: `create-lease.html`,
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
    currency: ['', Validators.required],
    termsText: ['', Validators.required],
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
        currency: val.currency!,
      },
      termsText: val.termsText!,
    });

    this.cancelled.emit();
  }
}
