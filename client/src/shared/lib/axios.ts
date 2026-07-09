import axios from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { STORAGE_KEYS } from "@features/auth/constants/authConstants";
import { API_BASE_URL } from "@shared/config/api";

interface ApiErrorShape {
  message: string;
  status: number | undefined;
  requiresVerification?: boolean;
  raw: AxiosError;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError<{ message?: string; requiresVerification?: boolean }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    const url = originalRequest.url || "";
    const isAuthRequest =
      url.includes("/login") ||
      url.includes("/register") ||
      url.includes("/refresh") ||
      url.includes("/auth/profile") ||
      url.includes("/auth/logout");

    // Handle 401 Unauthorized — try to refresh the access token once
    if (status === 401 && !isAuthRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        // Retry the original request with the new cookie
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh also failed — send user to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    const message = error.response?.data?.message ?? error.message ?? "Something went wrong.";
    const requiresVerification =
      typeof error.response?.data === "object" &&
      error.response?.data !== null &&
      "requiresVerification" in error.response.data
        ? Boolean((error.response.data as any).requiresVerification)
        : undefined;

    const apiError: ApiErrorShape = {
      message,
      status,
      requiresVerification,
      raw: error,
    };

    return Promise.reject(apiError);
  },
);

export default axiosInstance;
