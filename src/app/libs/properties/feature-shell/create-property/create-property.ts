import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { PropertiesFacade } from '../../data-access/properties.facade';

@Component({
  selector: 'app-create-property',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    Textarea,
  ],
  templateUrl: `./create-property.html`,
})
export class CreateProperty {
  @Output() cancelled = new EventEmitter<void>();

  readonly #fb = inject(FormBuilder);
  readonly #propertiesFacade = inject(PropertiesFacade);

  isBusy = this.#propertiesFacade.isBusy;

  form = this.#fb.group({
    propertyName: ['', Validators.required],
    address: ['', Validators.required],
    description: [''],
  });

  onSubmit() {
    if (this.form.invalid) return;

    const val = this.form.value;

    this.#propertiesFacade.createProperty({
      propertyName: val.propertyName!,
      address: val.address!,
      description: val.description || '',
    });

    this.cancelled.emit();
  }
}
