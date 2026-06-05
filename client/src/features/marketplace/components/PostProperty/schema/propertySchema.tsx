// client/src/features/marketplace/components/PostProperty/schema/propertySchema.ts
import { z } from "zod";

// ─── Step 1: Basic Info + Property Details ────────────────────────────────────
export const step1Schema = z.object({
  purpose: z
    .string({ error: "Purpose is required" })
    .min(1, "Please select a purpose"),

  propertyType: z
    .string({ error: "Property type is required" })
    .min(1, "Please select a property type"),

  title: z
    .string({ error: "Title is required" })
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string({ error: "Description is required" })
    .min(20, "Description must be at least 20 characters")
    .max(3000, "Description cannot exceed 3000 characters"),

  areaSize: z
    .string({ error: "Area size is required" })
    .min(1, "Area size is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Area must be a positive number",
    }),
});

// ─── Step 2: Pricing ──────────────────────────────────────────────────────────
export const step2Schema = z.object({
  price: z
    .string({ error: "Price is required" })
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a positive number",
    })
    .refine((val) => Number(val) >= 500000, {
      message: "Price must be at least PKR 5,00,000",
    }),
});

// ─── Combined type for error keys ─────────────────────────────────────────────
export const fullSchema = step1Schema.merge(step2Schema);
export type PropertyFormData = z.infer<typeof fullSchema>;
export type FieldErrors = Partial<Record<keyof PropertyFormData, string>>;
