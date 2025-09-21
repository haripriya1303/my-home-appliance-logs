const API_BASE_URL = 'http://localhost:3001/api';

export interface CreateApplianceRequest {
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  category: string;
  location: string;
  purchaseDate: string;
  warrantyExpiration: string;
  nextMaintenanceDate?: string;
  notes?: string;
}

export interface ApplianceResponse {
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
  notes?: string;
  status: 'under-warranty' | 'warranty-expired' | 'expiring-soon';
  createdAt: string;
  updatedAt: string;
}

class ApplianceService {
  private async fetch(url: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getAllAppliances(): Promise<ApplianceResponse[]> {
    const response = await this.fetch('/appliances');
    return response.data || [];
  }

  async getApplianceById(id: string): Promise<ApplianceResponse> {
    const response = await this.fetch(`/appliances/${id}`);
    return response.data;
  }

  async createAppliance(appliance: CreateApplianceRequest): Promise<ApplianceResponse> {
    const response = await this.fetch('/appliances', {
      method: 'POST',
      body: JSON.stringify(appliance),
    });
    return response.data;
  }

  async updateAppliance(id: string, appliance: Partial<CreateApplianceRequest>): Promise<ApplianceResponse> {
    const response = await this.fetch(`/appliances/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appliance),
    });
    return response.data;
  }

  async deleteAppliance(id: string): Promise<void> {
    await this.fetch(`/appliances/${id}`, {
      method: 'DELETE',
    });
  }
}

export const applianceService = new ApplianceService();