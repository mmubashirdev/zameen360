// src/features/marketplace/components/context/PropertyContext.tsx
import { createContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface UploadedImage {
  file: File;
  url: string;
  name?: string;
  size?: number;
}

export interface PropertyData {
  purpose?: string;
  propertyType?: string;
  title?: string;
  description?: string;
  areaSize?: string;
  areaUnit?: string;
  bedrooms?: string;
  bathrooms?: string;
  floors?: string;
  parking?: string;
  yearBuilt?: string;
  furnishing?: string;
  possession?: string;
  facing?: string;
  price?: string;
  negotiable?: boolean;
  installmentAvailable?: boolean;
  downPayment?: string;
  monthlyInstallment?: string;
  duration?: string;
  monthlyRent?: string;
  securityDeposit?: string;
  advanceMonths?: string;
  amenities?: string[];
  city?: string;
  locality?: string;
  address?: string;
  lat?: number;
  lng?: number;
  images?: string[];
  imageFiles?: UploadedImage[];
  videoUrl?: string;
  floorPlan?: string;
  panoramas?: PanoramaItem[];
}

export interface PanoramaItem {
  roomName?: string;
  file: File;
}
// ⭐ Errors type
export type PropertyErrors = Partial<Record<keyof PropertyData, string>>;

export interface PropertyContextType {
  data: PropertyData;
  updateData: (newData: Partial<PropertyData>) => void;
  resetData: () => void;
  errors: PropertyErrors;                  // ⭐ Add
  validate: (step: number) => boolean;     // ⭐ Add
  clearError: (field: keyof PropertyData) => void; // ⭐ Add
}

export const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const defaultData: PropertyData = {
  purpose: 'Sell',
  propertyType: 'House',
  areaUnit: 'Marla',
  amenities: [],
  images: [],
  imageFiles: [],
  negotiable: false,
  installmentAvailable: false,
};

export const PropertyProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<PropertyData>(defaultData);
  const [errors, setErrors] = useState<PropertyErrors>({});

  const updateData = (newData: Partial<PropertyData>) =>
    setData((prev) => ({ ...prev, ...newData }));

  const resetData = () => {
    setData(defaultData);
    setErrors({});
  };

  const clearError = (field: keyof PropertyData) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  // ⭐ Step-wise validation
  const validate = (step: number): boolean => {
    const newErrors: PropertyErrors = {};

    if (step === 1) {
      // Basic Information
      if (!data.purpose) newErrors.purpose = "Purpose is required";
      if (!data.propertyType) newErrors.propertyType = "Property type is required";
      if (!data.title || data.title.trim().length < 5)
        newErrors.title = "Title must be at least 5 characters";
      if (!data.description || data.description.trim().length < 20)
        newErrors.description = "Description must be at least 20 characters";

      // Property Details
      if (!data.areaSize) newErrors.areaSize = "Area size is required";
      if (!data.areaUnit) newErrors.areaUnit = "Area unit is required";

      // Pricing
      if (data.purpose === "Sell" && !data.price) {
        newErrors.price = "Price is required";
      }
      if (data.purpose === "Rent" && !data.monthlyRent) {
        newErrors.monthlyRent = "Monthly rent is required";
      }
    }

    if (step === 2) {
      // Media & Location
      if (!data.city) newErrors.city = "City is required";
      if (!data.locality) newErrors.locality = "Locality is required";
      if (!data.address) newErrors.address = "Address is required";
      if (!data.imageFiles || data.imageFiles.length === 0) {
        newErrors.imageFiles = "At least 1 image is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <PropertyContext.Provider
      value={{
        data,
        updateData,
        resetData,
        errors,
        validate,
        clearError,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};