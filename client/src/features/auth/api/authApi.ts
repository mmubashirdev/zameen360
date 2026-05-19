import axiosInstance from "@shared/lib/axios";
import { AUTH_ENDPOINTS } from "../constants/authConstants";
import type {
  RegisterResponse,
  ApiResponse,
  LoginFormValues,
  AuthSuccessPayload,
  VerifyOtpPayload,
} from "../types/auth.types";

export const registerUser = async (data: object): Promise<RegisterResponse> => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER, data);
  return {
    success: true,
    message: "User registered successfully",
    ...response,
  };
};

export const registerBuyer = async (data: object): Promise<RegisterResponse> => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER_BUYER, data);
  return {
    success: true,
    message: "Buyer registered successfully",
    ...response,
  };
};

export const registerSeller = async (data: object): Promise<RegisterResponse> => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER_SELLER, data);
  return {
    success: true,
    message: "Seller registered successfully",
    ...response,
  };
};

export const loginUser = async (
  credentials: LoginFormValues
): Promise<ApiResponse<AuthSuccessPayload>> => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, credentials);
  return {
    success: true,
    message: "Login successful",
    ...response,
  };
};

export const verifyOtp = async (
  payload: VerifyOtpPayload
): Promise<ApiResponse<AuthSuccessPayload>> => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.VERIFY_OTP, payload);
  return {
    success: true,
    message: "OTP verified successfully",
    ...response,
  };
};

export const resendOtp = async (payload: {
  email: string;
}): Promise<ApiResponse> => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.RESEND_OTP, payload);
  return {
    success: true,
    message: "OTP resent successfully",
    ...response,
  };
};

export const forgotPassword = async (payload: {
  email: string;
}): Promise<ApiResponse> => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, payload);
  return {
    success: true,
    message: "Password reset email sent",
    ...response,
  };
};

export const verifyResetOtp = async (payload: {
  email: string;
  otp: string;
}): Promise<ApiResponse> => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.VERIFY_RESET_OTP, {
    email: payload.email,
    otp: payload.otp,
    otpCode: payload.otp,
  });
  return {
    success: true,
    message: "Reset OTP verified successfully",
    ...response,
  };
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
  const response = await axiosInstance.post(AUTH_ENDPOINTS.RESET_PASSWORD, normalizedPayload);
  return {
    success: true,
    message: "Password reset successfully",
    ...response,
  };
};

export const getProfile = async (): Promise<ApiResponse> => {
  const response = await axiosInstance.get(AUTH_ENDPOINTS.PROFILE);
  return {
    success: true,
    message: "Profile fetched successfully",
    ...response,
  };
};