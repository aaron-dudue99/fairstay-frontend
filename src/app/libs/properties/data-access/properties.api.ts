import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../shared/data-access/http-service';
import { firstValueFrom } from 'rxjs';
import { Property, PropertyRequest, Unit, UnitRequest } from './properties.models';
import { ApiResponse } from '../../../shared/data-access/api-config';

@Injectable({
  providedIn: 'root',
})
export class PropertiesApi {
  private http = inject(HttpService);
  private readonly basePath = 'properties';

  private async unwrap<T>(response: any): Promise<T> {
    const res = await firstValueFrom(response);
    return (res as ApiResponse).data;
  }

  getProperties(): Promise<Property[]> {
    return this.unwrap(this.http.get(this.basePath));
  }

  getProperty(id: string): Promise<Property> {
    return this.unwrap(this.http.get(`${this.basePath}/${id}`));
  }

  createProperty(data: PropertyRequest): Promise<Property> {
    return this.unwrap(this.http.post(this.basePath, data));
  }

  updateProperty(id: string, data: PropertyRequest): Promise<Property> {
    return this.unwrap(this.http.put(`${this.basePath}/${id}`, data));
  }

  deleteProperty(id: string): Promise<void> {
    return this.unwrap(this.http.delete(`${this.basePath}/${id}`));
  }

  getUnits(propertyId: string): Promise<Unit[]> {
    return this.unwrap(this.http.get(`${this.basePath}/${propertyId}/units`));
  }

  createUnit(propertyId: string, data: UnitRequest): Promise<Unit> {
    return this.unwrap(this.http.post(`${this.basePath}/${propertyId}/units`, data));
  }

  vacateUnit(propertyId: string, unitId: string): Promise<void> {
    return this.unwrap(
      this.http.patch(`${this.basePath}/${propertyId}/units/${unitId}/vacate`, {}),
    );
  }

  occupyUnit(propertyId: string, unitId: string): Promise<void> {
    return this.unwrap(
      this.http.patch(`${this.basePath}/${propertyId}/units/${unitId}/occupy`, {}),
    );
  }
}
