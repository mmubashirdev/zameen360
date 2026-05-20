import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { UploadedImage } from '../context/type';  // ⭐ Add this import

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
  images?: string[];
  imageFiles?: UploadedImage[];  // ⭐ Add this field — actual File objects
  videoUrl?: string;
  floorPlan?: string;
}

export interface PropertyContextType {
  data: PropertyData;
  updateData: (newData: Partial<PropertyData>) => void;
  resetData: () => void;
}

export const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const defaultData: PropertyData = {
  purpose: 'Sell',
  propertyType: 'House',
  areaUnit: 'Marla',
  amenities: [],
  images: [],
  imageFiles: [],  // ⭐ Add this default
  negotiable: false,
  installmentAvailable: false,
};

export const PropertyProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<PropertyData>(defaultData);

  const updateData = (newData: Partial<PropertyData>) =>
    setData((prev) => ({ ...prev, ...newData }));

  const resetData = () => setData(defaultData);

  return (
    <PropertyContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </PropertyContext.Provider>
  );
};