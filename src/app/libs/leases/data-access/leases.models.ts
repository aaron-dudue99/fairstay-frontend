export type LeaseStatus = 'DRAFT' | 'PENDING' | 'ACTIVE' | 'TERMINATED';

export interface LeaseSummary {
  id: string;
  unitId: string;
  landlordId: string;
  tenantId: string;
  startDate: string;
  endDate?: string;
  monthlyRent: number;
  currency: string;
  status: LeaseStatus;
  cretedAt: string;
}

export interface LeaseAgreement {
  id: string;
  termsText: string;
  acceptedByLandlord: boolean;
  acceptedByTenant: boolean;
  acceptedAt?: string;
}

export interface LeaseDetails {
  lease: LeaseSummary;

  agreement: LeaseAgreement | null;

  permissions: {
    canAccept: boolean;
    canTerminate: boolean;
    canViewPayments: boolean;
  };
}

export interface LeaseRequestDto {
  unitId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  currency: string;
  depositAmount: number;
}

export interface LeaseRequest {
  leaseRequestDto: LeaseRequestDto;
  termsText: string;
}
