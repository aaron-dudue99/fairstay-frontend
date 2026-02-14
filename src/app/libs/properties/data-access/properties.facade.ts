import { inject, Injectable } from '@angular/core';
import { PropertiesStore } from './properties.store';
import { PropertyRequest, UnitRequest } from './properties.models';

@Injectable({ providedIn: 'root' })
export class PropertiesFacade {
  readonly #store = inject(PropertiesStore);

  readonly properties = this.#store.properties;
  readonly units = this.#store.units;
  readonly status = this.#store.status;
  readonly error = this.#store.error;
  readonly isBusy = this.#store.isBusy;
  
  // Computed metrics
  readonly totalProperties = this.#store.totalProperties;
  readonly totalUnits = this.#store.totalUnits;
  readonly totalOccupied = this.#store.totalOccupied;
  readonly totalVacant = this.#store.totalVacant;

  loadProperties() {
    this.#store.loadProperties();
  }

  loadUnits(propertyId: string) {
    this.#store.loadUnits(propertyId);
  }

  createProperty(data: PropertyRequest) {
    this.#store.createProperty(data);
  }
  
  createUnit(propertyId: string, data: UnitRequest) {
      this.#store.createUnit({ propertyId, data });
  }
}
