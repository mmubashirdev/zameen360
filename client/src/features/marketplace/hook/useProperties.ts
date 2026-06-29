import { useQuery } from "@tanstack/react-query";
import { getProperties } from "../api/propertyApi";

type AnyRecord = Record<string, unknown>;

export const useProperties = (filters: AnyRecord) => {
  // normalize + keep only enumerable values for query key stability
  const stableKey = JSON.stringify(
    filters ?? {},
    Object.keys(filters ?? {}).sort(),
  );

  return useQuery({
    queryKey: ["properties", stableKey],
    queryFn: () => getProperties(filters),
    placeholderData: (prev) => prev,
    retry: 2,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });
};
