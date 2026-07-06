// src/hooks/usePropertyDetails.ts
import { useState, useEffect, useCallback } from "react";
import {
  API_BASE_URL,
  NGROK_SKIP_BROWSER_WARNING_HEADER,
} from "@shared/config/api";

const BASE_URL = API_BASE_URL;

export interface PropertyDetail {
  id: number;
  purpose: string | null;
  propertyType: string | null;
  title: string | null;
  description: string | null;
  areaSize: string | null;
  areaUnit: string | null;
  bedrooms: string | null;
  bathrooms: string | null;
  floors: string | null;
  parking: string | null;
  yearBuilt: string | null;
  furnishing: string | null;
  possession: string | null;
  facing: string | null;
  price: string | null;
  negotiable: boolean;
  installmentAvailable: boolean;
  downPayment: string | null;
  monthlyInstallment: string | null;
  duration: string | null;
  monthlyRent: string | null;
  securityDeposit: string | null;
  advanceMonths: string | null;
  amenities: string[];
  city: string | null;
  locality: string | null;
  address: string | null;
  images: string[];
  videoUrl: string | null;
  floorPlan: string | null;
  status: string;
  userId: number | null;
  createdAt: string;
  updatedAt: string;
  // User/Agent info
  user?: {
    id: number;
    fullName: string;
    email: string;
    phone: string | null;
    profilePicture: string | null;
    city: string | null;
    sellerDetail?: {
      totalListings: number;
      activeListings: number;
      sellerRating: string | null;
      isPremium: boolean;
    };
  };
}

interface UsePropertyDetailsReturn {
  property: PropertyDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const usePropertyDetails = (
  id: string | undefined,
): UsePropertyDetailsReturn => {
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = useCallback(async () => {
    // ID validate karo
    if (!id || isNaN(Number(id))) {
      setError("Invalid property ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/properties/${id}`, {
        headers: NGROK_SKIP_BROWSER_WARNING_HEADER,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch property");
      }

      if (result.success) {
        setProperty(result.data);
      } else {
        throw new Error(result.message || "Property not found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]); // ID change ho to refetch

  return { property, loading, error, refetch: fetchProperty };
};

export default usePropertyDetails;
