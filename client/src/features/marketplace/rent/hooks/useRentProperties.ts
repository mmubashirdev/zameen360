// client/src/features/marketplace/rent/hooks/useRentProperties.ts
import { useState, useCallback, useEffect } from "react";
import { rentApi, type RentFilters, type Property } from "../api/rentApi";

export const useRentProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState<RentFilters>({
    search: "",
    purpose: "Rent",
    propertyType: "",
    city: "",
    minPrice: "",
    maxPrice: "",
  });

  const fetchProperties = useCallback(async (activeFilters: RentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const result = await rentApi.getProperties(activeFilters);
      setProperties(result.data);
      setTotal(result.total);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch properties";
      setError(message);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on filter change
  useEffect(() => {
    fetchProperties(filters);
  }, [filters, fetchProperties]);

  const updateFilter = useCallback(
    <K extends keyof RentFilters>(key: K, value: RentFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      purpose: "Rent",
      propertyType: "",
      city: "",
      minPrice: "",
      maxPrice: "",
    });
  }, []);

  const refetch = useCallback(
    () => fetchProperties(filters),
    [fetchProperties, filters],
  );

  return {
    properties,
    loading,
    error,
    total,
    filters,
    updateFilter,
    resetFilters,
    refetch,
  };
};
