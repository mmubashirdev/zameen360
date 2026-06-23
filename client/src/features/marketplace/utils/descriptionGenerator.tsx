const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

type DescriptionPayload = {
  purpose?: string;
  propertyType?: string;
  title?: string;
  city?: string;
  locality?: string;
  bedrooms?: string;
  bathrooms?: string;
  floors?: string;
  parking?: string;
  yearBuilt?: string;
  furnishing?: string;
  possession?: string;
  facing?: string;
  price?: string;
  areaSize?: string;
  areaUnit?: string;
};

export async function generatePropertyDescription(data: DescriptionPayload) {
  const response = await fetch(`${BASE_URL}/ai/generate-description`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || "Failed to generate description");
  }

  return typeof result?.description === "string" ? result.description.trim() : "";
}
