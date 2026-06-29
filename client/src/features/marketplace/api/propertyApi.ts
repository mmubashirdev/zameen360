import axiosInstance from "../../../../src/api/axios";

export interface PropertyFilters {
  search?: string;
  purpose?: string;
  propertyType?: string;
  city?: string;
  locality?: string;

  // prices (server expects BigInt via BigInt(minPrice/maxPrice))
  minPrice?: number;
  maxPrice?: number;

  // bedrooms
  bedrooms?: number | string;
  minBeds?: number | string;
  maxBeds?: number | string;

  // bathrooms
  bathrooms?: number | string;
  minBaths?: number | string;
  maxBaths?: number | string;

  // area
  minArea?: number | string;
  maxArea?: number | string;
  areaUnit?: string;

  amenities?: string[];
}

const toNumberOrUndefined = (v: unknown) => {
  if (v === null || v === undefined) return undefined;
  if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
  const s = String(v).trim();
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
};

type AnyRecord = Record<string, unknown>;

const normalizeFilters = (
  filters: AnyRecord | PropertyFilters,
): Record<string, unknown> => {
  const normalized: Record<string, unknown> = {
    search: filters?.search || undefined,
    purpose: filters?.purpose || undefined,
    propertyType: filters?.propertyType || undefined,
    city: filters?.city || undefined,
    locality: filters?.locality || undefined,
    areaUnit: filters?.areaUnit || undefined,
  };

  const minPrice = toNumberOrUndefined(filters?.minPrice);
  const maxPrice = toNumberOrUndefined(filters?.maxPrice);
  if (minPrice !== undefined) normalized.minPrice = minPrice;
  if (maxPrice !== undefined) normalized.maxPrice = maxPrice;

  const minBeds = toNumberOrUndefined(filters?.minBeds);
  const maxBeds = toNumberOrUndefined(filters?.maxBeds);
  if (minBeds !== undefined) normalized.minBeds = minBeds;
  if (maxBeds !== undefined) normalized.maxBeds = maxBeds;

  const minBaths = toNumberOrUndefined(filters?.minBaths);
  const maxBaths = toNumberOrUndefined(filters?.maxBaths);
  if (minBaths !== undefined) normalized.minBaths = minBaths;
  if (maxBaths !== undefined) normalized.maxBaths = maxBaths;

  const minArea = toNumberOrUndefined(filters?.minArea);
  const maxArea = toNumberOrUndefined(filters?.maxArea);
  if (minArea !== undefined) normalized.minArea = minArea;
  if (maxArea !== undefined) normalized.maxArea = maxArea;

  // server expects amenities as comma-separated string
  if (Array.isArray(filters?.amenities) && filters.amenities.length > 0) {
    normalized.amenities = filters.amenities.join(",");
  }

  return normalized;
};

export const getProperties = async (filters: PropertyFilters) => {
  const normalized = normalizeFilters(filters);
  const { data } = await axiosInstance.get("/properties", {
    params: normalized,
  });

  // server returns: { success, count, data: [...] }
  // IMPORTANT: return the full server response so Buypage can read `data.data`
  return data;
};
