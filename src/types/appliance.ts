export interface Appliance {
  id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  category: string;
  location: string;
  purchaseDate: string;
  warrantyExpiration: string;
  nextMaintenanceDate?: string;
  status: 'under-warranty' | 'warranty-expired' | 'expiring-soon';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type WarrantyFilter = 'all' | 'active-warranty' | 'expiring-soon' | 'expired';