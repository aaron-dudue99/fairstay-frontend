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
  imports: [CommonModule, LeasesList, LeaseDetailsComponent, ButtonModule, MessageModule, CreateLease, DialogModule],
  template: `
    <div class="flex flex-col gap-8 max-w-7xl mx-auto pb-8 p-6">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">
            {{ isLandlord() ? 'Lease Management' : 'My Lease' }}
          </h1>
          <p class="text-gray-400">
            {{ isLandlord() ? 'Manage and track all your property agreements.' : 'View and manage your current rental agreement.' }}
          </p>
        </div>
        <div class="flex gap-3" *ngIf="isLandlord() && !selectedLeaseId()">
          <button
            (click)="triggerCreateLease()"
            class="px-5 py-2.5 rounded-xl bg-primary text-primary-contrast font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
            <i class="pi pi-plus"></i>
            <span>New Lease</span>
          </button>
        </div>
      </div>

      <!-- Actions Section -->
      @if (pendingActions().length > 0) {
        <div class="glass p-8 rounded-3xl border-l-4 border-yellow-500 relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-[40px] -mr-8 -mt-8 pointer-events-none"></div>
          
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-yellow-500/10 border border-yellow-500/30">
              <i class="pi pi-exclamation-triangle text-yellow-500 text-xl"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Actions Required</h3>
              <p class="text-sm text-gray-400">You have leases awaiting your approval or action.</p>
            </div>
          </div>

          <div class="flex flex-col gap-4">
            @for (action of pendingActions(); track action.lease.id) {
              <div class="flex justify-between items-center p-4 rounded-2xl hover:bg-surface-hover transition-colors border border-transparent hover:border-surface-border glass-panel">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-500/20">
                    <i class="pi pi-file text-yellow-500"></i>
                  </div>
                  <div>
                    <h4 class="text-white font-bold text-sm">Lease for {{ action.lease.unitId }}</h4>
                    <p class="text-gray-400 text-xs text-ellipsis overflow-hidden">Agreement with {{ action.lease.tenantId }}</p>
                  </div>
                </div>
                <button 
                  (click)="viewLease(action.lease.id)"
                  class="px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-500 text-xs font-bold hover:bg-yellow-500/20 transition-all">
                  Review Details
                </button>
              </div>
            }
          </div>
        </div>
      }

      <!-- Main Content -->
      <div class="flex flex-col gap-6">
        @if (isLandlord()) {
          @if (selectedLeaseId()) {
            <div class="flex flex-col gap-4">
              <button 
                (click)="clearSelection()"
                class="w-fit flex items-center gap-2 text-primary hover:underline font-bold text-sm">
                <i class="pi pi-arrow-left"></i>
                <span>Back to Leases List</span>
              </button>
              <app-lease-details [leaseId]="selectedLeaseId()!"></app-lease-details>
            </div>
          } @else {
            <app-leases-list #leasesList></app-leases-list>
          }
        } @else if (isTenant()) {
          <app-lease-details></app-lease-details>
        }
      </div>

      <!-- Create Lease Dialog -->
      <p-dialog 
        header="Create New Lease" 
        [(visible)]="showCreateLease" 
        [modal]="true" 
        [style]="{ width: '40rem' }"
        [breakpoints]="{ '960px': '75vw', '640px': '90vw' }"
        [draggable]="false" 
        [resizable]="false"
        appendTo="body"
        styleClass="glass rounded-3xl border-none">
        <app-create-lease (cancelled)="showCreateLease.set(false)"></app-create-lease>
      </p-dialog>
    </div>
  `,
  styles: [``]
})
export class Leases {
  readonly #authFacade = inject(AuthFacade);
  readonly #leasesFacade = inject(LeasesFacade);

  isLandlord = this.#authFacade.isLandlord;
  isTenant = this.#authFacade.isTenant;
  
  showCreateLease = signal(false);
  selectedLeaseId = computed(() => this.#leasesFacade.currentLease()?.lease.id);

  pendingActions = computed(() => {
    return Object.values(this.#leasesFacade.entities()).filter(d => d.permissions.canAccept);
  });

  viewLease(id: string) {
    this.#leasesFacade.loadLeaseById(id);
  }

  clearSelection() {
    this.#leasesFacade.clearSelectedLease();
  }

  triggerCreateLease() {
    this.showCreateLease.set(true);
  }
}
