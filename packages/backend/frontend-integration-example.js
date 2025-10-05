// Frontend API service to integrate with the Express backend
// Add this to your React frontend in src/services/api.ts

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error occurred');
  }
}

export const applianceAPI = {
  // Get all appliances with optional filtering
  getAll: (params?: {
    search?: string;
    filter?: 'all' | 'active-warranty' | 'expiring-soon';
    category?: string;
    limit?: number;
    offset?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const query = searchParams.toString();
    return apiRequest(`/appliances${query ? `?${query}` : ''}`);
  },

  // Get appliance by ID
  getById: (id: string) => 
    apiRequest(`/appliances/${id}`),

  // Create new appliance
  create: (data: CreateApplianceRequest) =>
    apiRequest('/appliances', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update appliance
  update: (id: string, data: Partial<CreateApplianceRequest>) =>
    apiRequest(`/appliances/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete appliance
  delete: (id: string) =>
    apiRequest(`/appliances/${id}`, {
      method: 'DELETE',
    }),

  // Get dashboard statistics
  getStats: () =>
    apiRequest('/appliances/stats'),
};

// Usage example in React components:
/*
import { applianceAPI } from './services/api';

// In your component
const [appliances, setAppliances] = useState([]);
const [loading, setLoading] = useState(false);

const fetchAppliances = async () => {
  setLoading(true);
  try {
    const response = await applianceAPI.getAll({ 
      filter: 'active-warranty',
      limit: 10 
    });
    
    if (response.success) {
      setAppliances(response.data);
    }
  } catch (error) {
    console.error('Failed to fetch appliances:', error.message);
  } finally {
    setLoading(false);
  }
};

const createAppliance = async (applianceData) => {
  try {
    const response = await applianceAPI.create(applianceData);
    if (response.success) {
      console.log('Appliance created:', response.data);
      // Refresh the list
      fetchAppliances();
    }
  } catch (error) {
    console.error('Failed to create appliance:', error.message);
  }
};
*/