import { inject, Injectable } from '@angular/core';
import { LeasesStore } from './leases.store';
import { LeaseDetails, LeaseRequest } from './leases.models';

@Injectable({ providedIn: 'root' })
export class LeasesFacade {
  readonly #leasesStore = inject(LeasesStore);

  readonly currentLease = this.#leasesStore.currentLease;
  readonly status = this.#leasesStore.status;
  readonly error = this.#leasesStore.error;
  readonly isBusy = this.#leasesStore.isBusy;
  readonly entities = this.#leasesStore.entities;

  loadLeaseById(leaseId: string) {
    this.#leasesStore.loadLeaseById(leaseId);
  }

  acceptAsTenant(leaseId: string) {
    this.#leasesStore.acceptAsTenant(leaseId);
  }

  acceptAsLandlord(leaseId: string) {
    this.#leasesStore.acceptAsLandlord(leaseId);
  }

  createLease(request: LeaseRequest) {
    this.#leasesStore.createLease(request);
  }

  terminateLease(leaseId: string) {
    this.#leasesStore.terminateLease(leaseId);
  }

  clearSelectedLease() {
    this.#leasesStore.resetCurrentLease();
  }
}
