import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL?.trim();

export const API_BASE_URL = apiUrl ? apiUrl.replace(/\/$/, "") : "/api";
export const API_ORIGIN = window.location.origin;
export const CHAT_API_BASE_URL = `${API_BASE_URL}/chat`;
export const SOCKET_URL = window.location.origin;
export const NGROK_SKIP_BROWSER_WARNING_HEADER = {
  "ngrok-skip-browser-warning": "true",
};

axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";
