import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../shared/data-access/http-service';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../../../shared/data-access/api-config';
import { LeaseDetails, LeaseRequest } from './leases.models';

@Injectable({
  providedIn: 'root',
})
export class LeasesApi {
  private http = inject(HttpService);

  private readonly basePath = 'leases';

  private async unwrap<T>(response: any): Promise<T> {
    const res = await firstValueFrom(response);
    return (res as ApiResponse).data;
  }

  createLease(leaseRequest: LeaseRequest): Promise<LeaseDetails> {
    return this.unwrap(this.http.post(`${this.basePath}`, leaseRequest));
  }

  acceptAsTenant(leaseId: string): Promise<LeaseDetails> {
    return this.unwrap(
      this.http.post(`${this.basePath}/${leaseId}/agreement/accept_as_tenant`, {}),
    );
  }

  acceptAsLandlord(leaseId: string): Promise<LeaseDetails> {
    return this.unwrap(
      this.http.post(`${this.basePath}/${leaseId}/agreement/accept_as_landlord`, {}),
    );
  }

  getLeaseById(leaseId: string): Promise<LeaseDetails> {
    return this.unwrap(this.http.get(`${this.basePath}/${leaseId}`));
  }

  terminateLease(leaseId: string): Promise<LeaseDetails> {
    return this.unwrap(this.http.post(`${this.basePath}/${leaseId}/terminate`, {}));
  }
}
