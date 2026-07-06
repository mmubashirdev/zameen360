import {
  API_BASE_URL,
  NGROK_SKIP_BROWSER_WARNING_HEADER,
} from "@shared/config/api";

const BASE_URL = API_BASE_URL;

export type ParsedSearchFilters = {
  type: string | null;
  propertyType: string | null;
  purpose: "Sell" | "Rent" | null;
  city: string | null;
  locality: string | null;
  area?: string | null;
  bedrooms: number | null;
  minBeds: number | null;
  maxBeds: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  min_price?: number | null;
  max_price?: number | null;
  features: string[];
  search: string | null;
};

export const PROPERTY_TYPE_OPTIONS = [
  "House",
  "Apartment",
  "Commercial",
  "Plot / Land",
  "Villa",
  "Shop",
  "Office",
  "Warehouse",
  "Agricultural",
  "Room",
  "Penthouse",
] as const;

export const AMENITY_OPTIONS = [
  "Parking",
  "Swimming Pool",
  "Garden",
  "Gym",
  "Elevator",
  "Security",
  "CCTV",
  "Balcony",
  "Central AC",
  "Servant Quarter",
  "Solar Panels",
  "Furnished",
] as const;

export const canonicalizePropertyType = (value: string | null | undefined) => {
  if (!value) return "";
  const normalized = value.trim().toLowerCase();
  const match = PROPERTY_TYPE_OPTIONS.find(
    (option) => option.toLowerCase() === normalized,
  );
  return match || value.trim();
};

export const canonicalizeAmenity = (value: string | null | undefined) => {
  if (!value) return "";
  const normalized = value.trim().toLowerCase();
  const match = AMENITY_OPTIONS.find(
    (option) => option.toLowerCase() === normalized,
  );
  return match || value.trim();
};

type ApiResponse = {
  success: boolean;
  filters?: ParsedSearchFilters;
  message?: string;
};

export async function parseSearchQuery(
  query: string,
): Promise<ParsedSearchFilters> {
  const response = await fetch(`${BASE_URL}/ai/parse-search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...NGROK_SKIP_BROWSER_WARNING_HEADER,
    },
    body: JSON.stringify({ query }),
  });

  const result = (await response
    .json()
    .catch(() => null)) as ApiResponse | null;

  if (!response.ok) {
    throw new Error(result?.message || "Failed to parse search query");
  }

  const filters = result?.filters;

  const canonicalFeatures = Array.isArray(filters?.features)
    ? filters.features
        .map((feature) => canonicalizeAmenity(feature))
        .filter(Boolean)
    : [];

  return {
    type: filters?.type ?? null,
    propertyType: filters?.propertyType ?? null,
    purpose: filters?.purpose ?? null,
    city: filters?.city ?? null,
    locality: filters?.locality ?? filters?.area ?? null,
    area: filters?.area ?? null,
    bedrooms: typeof filters?.bedrooms === "number" ? filters.bedrooms : null,
    minBeds: typeof filters?.minBeds === "number" ? filters.minBeds : null,
    maxBeds: typeof filters?.maxBeds === "number" ? filters.maxBeds : null,
    minPrice:
      typeof filters?.minPrice === "number"
        ? filters.minPrice
        : typeof filters?.min_price === "number"
          ? filters.min_price
          : null,
    maxPrice:
      typeof filters?.maxPrice === "number"
        ? filters.maxPrice
        : typeof filters?.max_price === "number"
          ? filters.max_price
          : null,
    min_price:
      typeof filters?.min_price === "number" ? filters.min_price : null,
    max_price:
      typeof filters?.max_price === "number" ? filters.max_price : null,
    features: canonicalFeatures,
    search: filters?.search ?? null,
  };
}
