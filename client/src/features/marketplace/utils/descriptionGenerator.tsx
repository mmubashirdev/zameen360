/* eslint-disable react-refresh/only-export-components */
import {
  API_BASE_URL,
  NGROK_SKIP_BROWSER_WARNING_HEADER,
} from "@shared/config/api";

const BASE_URL = API_BASE_URL;

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
      ...NGROK_SKIP_BROWSER_WARNING_HEADER,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || "Failed to generate description");
  }

  return typeof result?.description === "string"
    ? result.description.trim()
    : "";
}
