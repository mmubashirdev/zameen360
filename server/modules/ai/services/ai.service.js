const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

async function generatePropertyDescription(data = {}) {
  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const prompt = `Write a professional real estate description in 1 concise paragraph.

Property Purpose: ${data.purpose || "N/A"}
Property Type: ${data.propertyType || "N/A"}
Title: ${data.title || "N/A"}
City: ${data.city || "N/A"}
Locality: ${data.locality || "N/A"}
Bedrooms: ${data.bedrooms || "N/A"}
Bathrooms: ${data.bathrooms || "N/A"}
Floors: ${data.floors || "N/A"}
Parking: ${data.parking || "N/A"}
Year Built: ${data.yearBuilt || "N/A"}
Area: ${data.areaSize || "N/A"} ${data.areaUnit || ""}
Price: ${data.price || "N/A"}
Furnishing: ${data.furnishing || "N/A"}
Possession: ${data.possession || "N/A"}
Facing Direction: ${data.facing || "N/A"}

Requirements:
- Keep it natural and persuasive
- Do not use bullet points
- Avoid markdown or headings
- Return only the description text`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return (response.text || "").trim();
}

const extractJson = (text = "") => {
  const trimmed = String(text).trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) return fencedMatch[1].trim();

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
};

const normalizeString = (val) => {
  if (val === null || val === undefined) return null;
  const str = String(val).trim();
  return str ? str : null;
};

const normalizeNumber = (val) => {
  if (val === null || val === undefined || val === "") return null;
  if (typeof val === "number" && Number.isFinite(val)) return val;

  const raw = String(val).trim().toLowerCase().replace(/,/g, "");
  const numeric = raw.match(/(\d+(?:\.\d+)?)/);
  if (!numeric) return null;

  const base = Number(numeric[1]);
  if (!Number.isFinite(base)) return null;

  if (raw.includes("crore")) return Math.round(base * 10000000);
  if (raw.includes("lakh")) return Math.round(base * 100000);
  if (raw.includes("k")) return Math.round(base * 1000);
  if (raw.includes("m")) return Math.round(base * 1000000);

  return Math.round(base);
};

async function parseSearchQuery(query = "") {
  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const prompt = `Extract structured real-estate filters from the user's search text.

Return valid JSON only. No markdown, no explanation, no extra text.

Schema:
{
  "type": string | null,
  "propertyType": string | null,
  "purpose": "Sell" | "Rent" | null,
  "city": string | null,
  "locality": string | null,
  "bedrooms": number | null,
  "minBeds": number | null,
  "maxBeds": number | null,
  "minPrice": number | null,
  "maxPrice": number | null,
  "features": string[],
  "search": string | null
}

Rules:
- Convert prices to PKR integers.
- Understand Pakistani units like crore, lakh, and thousand.
- If the user says "under", set maxPrice.
- If the user says "above" or "at least", set minPrice.
- Treat neighborhoods/areas like "DHA Phase 6" as locality.
- Use "house", "apartment", "villa", "plot / land", "commercial", "shop", "office", or "warehouse" when relevant.
- Infer features such as parking, balcony, furnished, security, garden, gym, elevator, CCTV.
- Keep null for anything not explicitly mentioned.

User query: ${query}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const rawText = extractJson(response.text || "");
  const parsed = JSON.parse(rawText);

  const propertyType = normalizeString(parsed.propertyType || parsed.type);
  const city = normalizeString(parsed.city);
  const locality = normalizeString(parsed.locality);
  const purpose = normalizeString(parsed.purpose);
  const search = normalizeString(parsed.search);

  const features = Array.isArray(parsed.features)
    ? parsed.features.map(normalizeString).filter(Boolean)
    : [];

  const bedrooms = normalizeNumber(parsed.bedrooms);
  const minBeds = normalizeNumber(parsed.minBeds);
  const maxBeds = normalizeNumber(parsed.maxBeds);
  const minPrice = normalizeNumber(parsed.minPrice);
  const maxPrice = normalizeNumber(parsed.maxPrice);

  return {
    type: propertyType,
    propertyType,
    purpose: purpose === "Sell" || purpose === "Rent" ? purpose : null,
    city,
    locality,
    area: locality,
    bedrooms,
    minBeds,
    maxBeds,
    minPrice,
    min_price: minPrice,
    maxPrice,
    max_price: maxPrice,
    features,
    search,
  };
}

module.exports = {
  generatePropertyDescription,
  parseSearchQuery,
};
