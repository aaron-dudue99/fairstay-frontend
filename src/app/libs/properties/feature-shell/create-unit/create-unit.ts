import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PropertiesFacade } from '../../data-access/properties.facade';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-create-unit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: `./create-unit.html`,
})
export class CreateUnit {
  @Input({ required: true }) propertyId!: string;
  @Output() cancelled = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  readonly #fb = inject(FormBuilder);
  readonly #propertiesFacade = inject(PropertiesFacade);

  isBusy = this.#propertiesFacade.isBusy;

  statusOptions = [
    { label: 'Vacant', value: 'VACANT' },
    { label: 'Occupied', value: 'OCCUPIED' },
  ];

  form = this.#fb.group({
    unitLabel: ['', Validators.required],
    status: ['VACANT', Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) return;

    const val = this.form.value;

    this.#propertiesFacade.createUnit(this.propertyId, {
      propertyId: this.propertyId,
      unitLabel: val.unitLabel!,
      status: val.status as 'VACANT' | 'OCCUPIED',
    });

    this.created.emit();
    this.cancelled.emit();
  }
}
