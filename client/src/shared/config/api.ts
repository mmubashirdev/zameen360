import axios from "axios";

const configuredApiUrl =
  import.meta.env.VITE_API_URL?.trim() ||
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  // Production fallback (Render backend)
  "https://zameen360.onrender.com";

const normalizeApiBaseUrl = (value?: string) => {
  // Default: same-host relative calls in local/dev
  if (!value) return "/api";

  const trimmed = value.trim().replace(/\/$/, "");

  // If it is a full URL (origin or origin+path), ensure it ends with `/api`
  if (/^https?:\/\//i.test(trimmed)) {
    // If caller already provided `/api`, keep it
    if (trimmed.toLowerCase().endsWith("/api")) return trimmed;

    // If caller provided some other path, append `/api`
    return `${trimmed}/api`;
  }

  // If it is a path (e.g. `/api` or `api`), ensure it starts with `/api`
  const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (normalizedPath.toLowerCase().endsWith("/api")) return normalizedPath;
  return `${normalizedPath}/api`;
};

export const API_BASE_URL = normalizeApiBaseUrl(configuredApiUrl);
export const API_ORIGIN = window.location.origin;
export const CHAT_API_BASE_URL = `${API_BASE_URL}/chat`;
export const SOCKET_URL = window.location.origin;
export const NGROK_SKIP_BROWSER_WARNING_HEADER = {
  "ngrok-skip-browser-warning": "true",
};

axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";
