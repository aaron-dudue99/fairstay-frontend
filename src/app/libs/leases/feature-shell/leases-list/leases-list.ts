import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { LeasesFacade } from '../../data-access/leases.facade';
import { LeaseSummary } from '../../data-access/leases.models';
import { CreateLease } from '../create-lease/create-lease';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-leases-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule],
  template: `
    <div class="glass p-8 rounded-3xl">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-white font-bold text-lg">Active Leases</h3>
        <!-- Removed redundant title/button since it's in the shell header now -->
      </div>

      <p-table 
        [value]="leases()" 
        [tableStyle]="{ 'min-width': '50rem' }"
        styleClass="p-datatable-sm">
        <ng-template pTemplate="header">
          <tr>
            <th class="!text-xs !font-bold !text-gray-500 !uppercase">Unit</th>
            <th class="!text-xs !font-bold !text-gray-500 !uppercase">Tenant</th>
            <th class="!text-xs !font-bold !text-gray-500 !uppercase">Period</th>
            <th class="!text-xs !font-bold !text-gray-500 !uppercase">Rent</th>
            <th class="!text-xs !font-bold !text-gray-500 !uppercase">Status</th>
            <th class="!text-xs !font-bold !text-gray-500 !uppercase">Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-lease>
          <tr class="hover:bg-surface-hover transition-colors border-b border-white/5">
            <td class="!py-4">
              <div class="font-bold text-white text-sm">{{ lease.unitId }}</div>
            </td>
            <td class="!py-4">
              <span class="text-gray-300 text-sm">{{ lease.tenantId }}</span>
            </td>
            <td class="!py-4">
              <div class="text-xs flex flex-col gap-0.5">
                <span class="text-white">{{ lease.startDate | date: 'mediumDate' }}</span>
                <span class="text-gray-500">to {{ lease.endDate ? (lease.endDate | date: 'mediumDate') : 'Present' }}</span>
              </div>
            </td>
            <td class="!py-4 font-mono text-primary font-bold text-sm">
              {{ lease.monthlyRent | currency: lease.currency }}
            </td>
            <td class="!py-4">
              <p-tag 
                [value]="lease.status" 
                [severity]="getSeverity(lease.status)"
                styleClass="!text-[10px] !font-bold !px-2 !py-0.5">
              </p-tag>
            </td>
            <td class="!py-4">
              <button 
                (click)="viewDetails(lease)"
                class="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-surface-hover transition-colors group">
                <i class="pi pi-arrow-right text-gray-400 group-hover:text-primary text-xs transition-colors"></i>
              </button>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="6" class="text-center p-12 text-gray-500 text-sm">
              No leases found.
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-datatable {
      background: transparent;
    }
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background: transparent;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding: 1rem 0.5rem;
    }
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      background: transparent;
      border: none;
      color: var(--text-color);
    }
  `]
})
export class LeasesList {
  readonly #leasesFacade = inject(LeasesFacade);
  
  leases = computed(() => {
    const list = Object.values(this.#leasesFacade.entities());
    return list.map(d => d.lease);
  });
  

  getSeverity(status: string) {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'PENDING': return 'warn';
      case 'TERMINATED': return 'danger';
      case 'DRAFT': return 'info';
      default: return 'secondary';
    }
  }

  viewDetails(lease: LeaseSummary) {
    this.#leasesFacade.loadLeaseById(lease.id);
  }
}
