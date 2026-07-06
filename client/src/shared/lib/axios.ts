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
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,

  (error: AxiosError<{ message?: string; requiresVerification?: boolean }>) => {
    const message =
      error.response?.data?.message ?? error.message ?? "Something went wrong.";

    const status = error.response?.status;

    const requiresVerification =
      typeof error.response?.data === "object" &&
      error.response?.data !== null &&
      "requiresVerification" in error.response.data
        ? Boolean((error.response.data as any).requiresVerification)
        : undefined;

    // Auto logout on 401 (but not for login/register)
    const url = error.config?.url || "";
    const isAuthRequest = url.includes("/login") || url.includes("/register");

    if (status === 401 && !isAuthRequest) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      window.location.href = "/login";
    }

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
