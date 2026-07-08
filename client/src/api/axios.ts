import axios from "axios";
import { API_BASE_URL } from "@shared/config/api";

// ⚠️ Same key jo auth ke STORAGE_KEYS.TOKEN mein hai
const TOKEN_KEY = "zameen360_token";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  withCredentials: true,
});

// Har request ke saath token automatic add ho jayega
API.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Authentication failed - token invalid/expired");
    }
    return Promise.reject(error);
  },
);

export default API;
