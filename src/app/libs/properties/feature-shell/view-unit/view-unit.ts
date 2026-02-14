import { Component, computed, inject, Input } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { LeasesFacade } from '../../../leases/data-access/leases.facade';
import { Unit } from '../../data-access/properties.models';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-view-unit',
  standalone: true,
  imports: [CommonModule, TagModule],
  templateUrl: `./view-unit.html`,
})
export class ViewUnit {
  @Input({ required: true }) unit!: Unit;

  readonly #leasesFacade = inject(LeasesFacade);

  activeLease = computed(() => {
    const allLeases = Object.values(this.#leasesFacade.entities());
    const unitId = this.unit.id;
    // Find active or pending lease for this unit
    return allLeases.find(
      (l) =>
        l.lease.unitId === unitId &&
        (l.lease.status === 'ACTIVE' || l.lease.status === 'PENDING'),
    );
  });

  getSeverity(status: string) {
    switch (status) {
      case 'OCCUPIED':
        return 'success';
      case 'VACANT':
        return 'secondary';
      default:
        return 'info';
    }
  }

  getLeaseSeverity(status: string) {
      switch (status) {
          case 'ACTIVE': return 'success';
          case 'PENDING': return 'warn';
          case 'TERMINATED': return 'danger';
          default: return 'info';
      }
  }
}
