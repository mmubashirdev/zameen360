import axios from "axios";
import { STORAGE_KEYS } from "../constants/authConstants";
import { API_BASE_URL } from "../../../shared/config/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  return config;
});

export default api;
