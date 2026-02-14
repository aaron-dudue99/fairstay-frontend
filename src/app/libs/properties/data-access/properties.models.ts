export interface Property {
  id: string;
  propertyName: string;
  description: string;
  address: string;
}

export interface PropertyRequest {
  propertyName: string;
  description: string;
  address: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitLabel: string;
  status: 'OCCUPIED' | 'VACANT';
}

export interface UnitRequest {
  propertyId: string;
  unitLabel: string;
  status: 'OCCUPIED' | 'VACANT';
}
