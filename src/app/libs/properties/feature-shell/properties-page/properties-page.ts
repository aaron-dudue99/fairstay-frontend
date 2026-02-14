import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertiesFacade } from '../../data-access/properties.facade';
import { LeasesFacade } from '../../../leases/data-access/leases.facade';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { CreateProperty } from '../create-property/create-property';
import { CreateUnit } from '../create-unit/create-unit';
import { ViewUnit } from '../view-unit/view-unit';
import { Property, Unit } from '../../data-access/properties.models';

@Component({
  selector: 'app-properties-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TagModule,
    DialogModule,
    CreateProperty,
    CreateUnit,
    ViewUnit
  ],
  templateUrl: `./properties-page.html`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class PropertiesPage implements OnInit {
  readonly #propertiesFacade = inject(PropertiesFacade);
  readonly #leasesFacade = inject(LeasesFacade);

  showCreateProperty = signal(false);
  creatingUnitForPropertyId = signal<string | null>(null);
  viewingUnit = signal<Unit | null>(null);

  properties = this.#propertiesFacade.properties;
  units = this.#propertiesFacade.units;

  // Summary Metrics
  totalProperties = this.#propertiesFacade.totalProperties;
  totalUnits = this.#propertiesFacade.totalUnits;
  totalOccupied = this.#propertiesFacade.totalOccupied;
  totalVacant = this.#propertiesFacade.totalVacant;

  occupancyRate = computed(() => {
    const total = this.totalUnits();
    if (total === 0) return 0;
    return Math.round((this.totalOccupied() / total) * 100);
  });

  ngOnInit() {
    this.#propertiesFacade.loadProperties();
    this.#leasesFacade.loadAllLeases();
  }

  // Helper to get units for a specific property
  getPropertyUnits(propertyId: string) {
    // Trigger load if not present (simple caching strategy)
    const units = this.units()[propertyId];
    if (!units && !this.#propertiesFacade.isBusy()) {
      this.#propertiesFacade.loadUnits(propertyId);
    }
    return units || [];
  }

  // Track units loading state per property to avoid spamming
  loadedProperties = new Set<string>();

  toggleUnits(propertyId: string) {
    if (!this.loadedProperties.has(propertyId)) {
      this.#propertiesFacade.loadUnits(propertyId);
      this.loadedProperties.add(propertyId);
    }
  }

  getUnitSeverity(status: string) {
    return status === 'OCCUPIED' ? 'success' : 'secondary';
  }

  createLease(unit: Unit) {
    // Navigate to lease creation or open dialog
    console.log('Create lease for unit', unit);
    // For now, trigger existing lease creation flow if applicable or just log
  }

  viewLease(unit: Unit) {
    // Find active lease for unit and navigate
    console.log('View lease for unit', unit);
  }
}
