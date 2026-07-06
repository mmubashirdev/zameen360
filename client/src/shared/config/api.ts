import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim() || import.meta.env.VITE_API_BASE_URL?.trim();

const normalizeApiBaseUrl = (value?: string) => {
  if (!value) return "/api";

  const trimmed = value.trim().replace(/\/$/, "");

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

export const API_BASE_URL = normalizeApiBaseUrl(configuredApiUrl);
export const API_ORIGIN = window.location.origin;
export const CHAT_API_BASE_URL = `${API_BASE_URL}/chat`;
export const SOCKET_URL = window.location.origin;
export const NGROK_SKIP_BROWSER_WARNING_HEADER = {
  "ngrok-skip-browser-warning": "true",
};

axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";
