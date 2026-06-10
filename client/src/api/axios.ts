import axios from "axios";

// ⚠️ Same key jo auth ke STORAGE_KEYS.TOKEN mein hai
const TOKEN_KEY = "zameen360_token";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Har request ke saath token automatic add ho jayega
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Authentication failed - token invalid/expired");
    }
    return Promise.reject(error);
  }
);

export default API;