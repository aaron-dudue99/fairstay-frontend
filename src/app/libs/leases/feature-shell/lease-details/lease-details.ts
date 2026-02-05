import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { LeasesFacade } from '../../data-access/leases.facade';
import { LeaseActions } from '../lease-actions/lease-actions';
import { AuthFacade } from '../../../../core/auth/data-access/auth.facade';

@Component({
  selector: 'app-lease-details',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, LeaseActions],
  template: `
    <div class="glass p-8 rounded-3xl" *ngIf="leaseDetails() as details">
      <div class="flex justify-between items-start mb-8">
        <div>
          <h2 class="text-3xl font-bold text-white mb-2">Lease Details</h2>
          <div class="flex items-center gap-2">
            <span class="text-gray-400 text-sm">Unit</span>
            <span class="text-primary font-bold">{{ details.lease.unitId }}</span>
            <span class="text-gray-600 px-2">|</span>
            <span class="text-gray-400 text-sm">Agreement ID:</span>
            <span class="text-white font-mono text-xs uppercase">{{ details.lease.id.split('-')[0] }}</span>
          </div>
        </div>
        <p-tag 
          [value]="details.lease.status" 
          [severity]="getSeverity(details.lease.status)"
          styleClass="!text-xs !font-bold !px-3 !py-1">
        </p-tag>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div class="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none"></div>
          <h3 class="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Financials</h3>
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-end">
              <span class="text-gray-400 text-sm">Monthly Rent</span>
              <span class="text-white font-bold text-2xl font-mono">{{ details.lease.monthlyRent | currency: details.lease.currency }}</span>
            </div>
            <div class="h-px bg-white/5 w-full"></div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400 text-sm">Security Deposit</span>
              <span class="text-gray-300 font-semibold">{{ details.lease.monthlyRent * 2 | currency: details.lease.currency }}</span>
            </div>
          </div>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none"></div>
          <h3 class="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Duration</h3>
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center">
              <div class="flex flex-col">
                <span class="text-gray-400 text-xs">Start Date</span>
                <span class="text-white font-bold">{{ details.lease.startDate | date: 'longDate' }}</span>
              </div>
              <i class="pi pi-arrow-right text-gray-600"></i>
              <div class="flex flex-col items-end">
                <span class="text-gray-400 text-xs text-right">End Date</span>
                <span class="text-white font-bold">{{ details.lease.endDate ? (details.lease.endDate | date: 'longDate') : 'Indefinite' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-panel p-6 rounded-2xl border border-white/5 mb-8" *ngIf="details.agreement">
        <h3 class="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Terms & Conditions</h3>
        <div class="bg-black/20 p-6 rounded-xl text-gray-300 text-sm leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto border border-white/5 scrollbar-thin">
          {{ details.agreement.termsText }}
        </div>
      </div>

      <div class="flex justify-end pt-6 border-t border-white/5">
        <app-lease-actions 
          [leaseDetails]="details"
          (accept)="onAccept(details.lease.id)"
          (terminate)="onTerminate(details.lease.id)">
        </app-lease-actions>
      </div>
    </div>

    <div *ngIf="!leaseDetails() && !isLoading()" class="glass-panel p-16 rounded-3xl text-center flex flex-col items-center gap-4">
      <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
        <i class="pi pi-file-excel text-gray-500 text-2xl"></i>
      </div>
      <div>
        <h3 class="text-white font-bold text-lg">No lease selected</h3>
        <p class="text-gray-500">Pick a lease from the list to view its full details.</p>
      </div>
    </div>
  `
})
export class LeaseDetailsComponent implements OnInit {
  @Input() leaseId?: string;

  readonly #leasesFacade = inject(LeasesFacade);
  readonly #authFacade = inject(AuthFacade);

  leaseDetails = this.#leasesFacade.currentLease;
  isLoading = this.#leasesFacade.isBusy;
  isTenant = this.#authFacade.isTenant;

  ngOnInit() {
    if (this.leaseId) {
      this.#leasesFacade.loadLeaseById(this.leaseId);
    }
  }

  getSeverity(status: string) {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'PENDING': return 'warn';
      case 'TERMINATED': return 'danger';
      case 'DRAFT': return 'info';
      default: return 'info';
    }
  }

  onAccept(id: string) {
    if (this.isTenant()) {
      this.#leasesFacade.acceptAsTenant(id);
    } else {
      this.#leasesFacade.acceptAsLandlord(id);
    }
  }

  onTerminate(id: string) {
    this.#leasesFacade.terminateLease(id);
  }
}
