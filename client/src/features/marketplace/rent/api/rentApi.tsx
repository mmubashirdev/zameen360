// client/src/features/marketplace/rent/api/rentApi.ts
import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Property {
  id: number;
  title: string;
  city: string;
  locality: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  areaSize: string;
  areaUnit: string;
  purpose: string;
  propertyType: string;
  amenities: string[];
  images: string[];
  status: string;
}

export interface RentFilters {
  search: string;
  purpose: string;
  propertyType: string;
  city: string;
  minPrice: string;
  maxPrice: string;
}

interface ApiResponse {
  data: Property[];
  total: number;
  success: boolean;
}

// ─── Axios Instance ───────────────────────────────────────────────────────────

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor - attach token if exists ─────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor - normalize errors ──────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

// ─── API Functions ────────────────────────────────────────────────────────────

export const rentApi = {
  getProperties: async (filters: RentFilters): Promise<ApiResponse> => {
    const params: Record<string, string> = {};

    if (filters.search.trim()) params.search = filters.search.trim();
    if (filters.purpose) params.purpose = filters.purpose;
    if (filters.propertyType) params.propertyType = filters.propertyType;
    if (filters.city.trim()) params.city = filters.city.trim();
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;

    params.status = "approved";

    const response = await apiClient.get<
      ApiResponse & { count?: number } // ✅ backend sends count not total
    >("/properties", { params });

    const raw = response.data;

    if (raw.success && Array.isArray(raw.data)) {
      return {
        data: raw.data,
        total: raw.total ?? raw.count ?? raw.data.length, // ✅ handle count field
        success: true,
      };
    }

    if (Array.isArray(raw)) {
      return {
        data: raw as unknown as Property[],
        total: (raw as unknown as Property[]).length,
        success: true,
      };
    }

    return { data: [], total: 0, success: false };
  },
};
