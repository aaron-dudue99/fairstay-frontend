import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFacade } from '../../../core/auth/data-access/auth.facade';
import { LeasesFacade } from '../data-access/leases.facade';
import { LeasesList } from './leases-list/leases-list';
import { LeaseDetailsComponent } from './lease-details/lease-details';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CreateLease } from './create-lease/create-lease';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-leases',
  standalone: true,
  imports: [
    CommonModule,
    LeasesList,
    LeaseDetailsComponent,
    ButtonModule,
    MessageModule,
    CreateLease,
    DialogModule,
  ],
  templateUrl: `./leases.html`,
  styles: [``],
})
export class Leases {
  readonly #authFacade = inject(AuthFacade);
  readonly #leasesFacade = inject(LeasesFacade);

  isLandlord = this.#authFacade.isLandlord;
  isTenant = this.#authFacade.isTenant;

  showCreateLease = signal(false);
  selectedLeaseId = computed(() => this.#leasesFacade.currentLease()?.lease.id);

  pendingActions = computed(() => {
    return Object.values(this.#leasesFacade.entities()).filter((d) => d.permissions.canAccept);
  });

  viewLease(id: string) {
    this.#leasesFacade.loadLeaseById(id);
  }

  clearSelection() {
    this.#leasesFacade.clearSelectedLease();
  }

  triggerCreateLease() {
    console.log('Triggering create lease');
    this.showCreateLease.set(true);
  }
}
