import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { LeaseDetails } from '../../data-access/leases.models';

@Component({
  selector: 'app-lease-actions',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="flex gap-2" *ngIf="leaseDetails">
      <p-button 
        *ngIf="leaseDetails.permissions.canAccept" 
        label="Accept Agreement" 
        icon="pi pi-check" 
        severity="success"
        (onClick)="accept.emit()">
      </p-button>

      <p-button 
        *ngIf="leaseDetails.permissions.canTerminate" 
        label="Terminate Lease" 
        icon="pi pi-times" 
        severity="danger"
        styleClass="p-button-outlined"
        (onClick)="terminate.emit()">
      </p-button>
    </div>
  `
})
export class LeaseActions {
  @Input({ required: true }) leaseDetails!: LeaseDetails;
  @Output() accept = new EventEmitter<void>();
  @Output() terminate = new EventEmitter<void>();
}
