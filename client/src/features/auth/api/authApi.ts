import axiosInstance from "@shared/lib/axios";
import { AUTH_ENDPOINTS } from "../constants/authConstants";
import type {
  RegisterResponse,
  ApiResponse,
  LoginFormValues,
  AuthSuccessPayload,
  OtpDeliveryData,
  VerifyOtpPayload,
} from "../types/auth.types";

export const registerUser = async (data: object): Promise<RegisterResponse> => {
  return axiosInstance.post(AUTH_ENDPOINTS.REGISTER, data) as Promise<RegisterResponse>;
};

export const registerBuyer = async (data: object): Promise<RegisterResponse> => {
  return axiosInstance.post(
    AUTH_ENDPOINTS.REGISTER_BUYER,
    data,
  ) as Promise<RegisterResponse>;
};

export const registerSeller = async (data: object): Promise<RegisterResponse> => {
  return axiosInstance.post(
    AUTH_ENDPOINTS.REGISTER_SELLER,
    data,
  ) as Promise<RegisterResponse>;
};

export const loginUser = async (
  credentials: LoginFormValues
): Promise<ApiResponse<AuthSuccessPayload>> => {
  return axiosInstance.post(
    AUTH_ENDPOINTS.LOGIN,
    credentials,
  ) as Promise<ApiResponse<AuthSuccessPayload>>;
};

export const verifyOtp = async (
  payload: VerifyOtpPayload
): Promise<ApiResponse<AuthSuccessPayload>> => {
  return axiosInstance.post(
    AUTH_ENDPOINTS.VERIFY_OTP,
    payload,
  ) as Promise<ApiResponse<AuthSuccessPayload>>;
};

export const resendOtp = async (payload: {
  email: string;
}): Promise<ApiResponse<OtpDeliveryData>> => {
  return axiosInstance.post(
    AUTH_ENDPOINTS.RESEND_OTP,
    payload,
  ) as Promise<ApiResponse<OtpDeliveryData>>;
};

export const forgotPassword = async (payload: {
  email: string;
}): Promise<ApiResponse> => {
  return axiosInstance.post(
    AUTH_ENDPOINTS.FORGOT_PASSWORD,
    payload,
  ) as Promise<ApiResponse>;
};

export const resendResetOtp = async (payload: {
  email: string;
}): Promise<ApiResponse> => {
  return axiosInstance.post(
    AUTH_ENDPOINTS.FORGOT_PASSWORD,
    payload,
  ) as Promise<ApiResponse>;
};

export const verifyResetOtp = async (payload: {
  email: string;
  otp: string;
}): Promise<ApiResponse> => {
  return axiosInstance.post(AUTH_ENDPOINTS.VERIFY_RESET_OTP, {
    email: payload.email,
    otp: payload.otp,
    otpCode: payload.otp,
  }) as Promise<ApiResponse>;
};

export const resetPassword = async (payload: {
  email?: string;
  token?: string;
  password?: string;
  newPassword?: string;
  confirmPassword?: string;
}): Promise<ApiResponse> => {
  const normalizedPayload = {
    email: payload.email,
    otpCode: payload.token,
    newPassword: payload.newPassword || payload.password,
    confirmPassword: payload.confirmPassword || payload.password,
  };
  return axiosInstance.post(
    AUTH_ENDPOINTS.RESET_PASSWORD,
    normalizedPayload,
  ) as Promise<ApiResponse>;
};

export const getProfile = async (): Promise<ApiResponse> => {
  return axiosInstance.get(AUTH_ENDPOINTS.PROFILE) as Promise<ApiResponse>;
};

export const becomeSeller = async (): Promise<ApiResponse> => {
  return axiosInstance.post(AUTH_ENDPOINTS.BECOME_SELLER) as Promise<ApiResponse>;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout");
};
