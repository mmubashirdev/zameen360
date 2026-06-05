// client/src/features/marketplace/components/context/PropertyContext.tsx
import { createContext, useState, useCallback, type ReactNode } from "react";
import {
  step1Schema,
  step2Schema,
  type FieldErrors,
  type PropertyFormData,
} from "../PostProperty/schema/propertySchema";

// ─── PropertyData shape ───────────────────────────────────────────────────────
export interface PropertyData {
  // Basic
  purpose?: string;
  propertyType?: string;
  title?: string;
  description?: string;
  // Details
  areaSize?: string;
  areaUnit?: string;
  bedrooms?: string;
  bathrooms?: string;
  floors?: string;
  parking?: string;
  furnishing?: string;
  possession?: string;
  facing?: string;
  yearBuilt?: string;
  // Pricing
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
  // Location
  city?: string;
  locality?: string;
}

// ─── Context shape ────────────────────────────────────────────────────────────
interface PropertyContextValue {
  data: PropertyData;
  updateData: (updates: Partial<PropertyData>) => void;
  errors: FieldErrors;
  validate: (step: number) => boolean; // ✅ accepts step number
  clearErrors: () => void;
}

export const PropertyContext = createContext<PropertyContextValue | null>(null);


// ─── Provider ─────────────────────────────────────────────────────────────────
export const PropertyProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<PropertyData>({});
  const [errors, setErrors] = useState<FieldErrors>({});

  const updateData = useCallback((updates: Partial<PropertyData>) => {
    setData((prev) => ({ ...prev, ...updates }));
    // Clear errors for touched fields immediately
    setErrors((prev) => {
      const next = { ...prev };
      (Object.keys(updates) as Array<keyof PropertyData>).forEach((key) => {
        delete next[key as keyof FieldErrors];
      });
      return next;
    });
  }, []);

  const validate = useCallback(
    (step: number): boolean => {
      // ✅ Pick the right schema for the current step
      const schema = step === 1 ? step1Schema : step2Schema;

      // ✅ Build the payload matching the schema fields
      const payload =
        step === 1
          ? {
              purpose: data.purpose ?? "",
              propertyType: data.propertyType ?? "",
              title: data.title ?? "",
              description: data.description ?? "",
              areaSize: data.areaSize ?? "",
            }
          : {
              price: data.price ?? "",
            };

      const result = schema.safeParse(payload);

      if (result.success) {
        setErrors({});
        return true;
      }

      // ✅ Flatten errors: {fieldName: "first error message"}
      const flat: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof PropertyFormData;
        if (field && !flat[field]) {
          flat[field] = issue.message;
        }
      }

      setErrors(flat);
      return false; // ✅ Caller will block navigation
    },
    [data],
  );

  const clearErrors = useCallback(() => setErrors({}), []);

  return (
    <PropertyContext.Provider
      value={{ data, updateData, errors, validate, clearErrors }}
    >
      {children}
    </PropertyContext.Provider>
  );
};
