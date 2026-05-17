import axiosInstance from "@shared/lib/axios";
import { AUTH_ENDPOINTS } from "../constants/authConstants";
import type {
  RegisterResponse,
  ApiResponse,
  LoginFormValues,
  AuthSuccessPayload,
  VerifyOtpPayload,
} from "../types/auth.types";


export const registerUser = (data: object): Promise<RegisterResponse> =>
  axiosInstance.post(AUTH_ENDPOINTS.REGISTER, data);

export const registerBuyer = (data: object): Promise<RegisterResponse> =>
  axiosInstance.post(AUTH_ENDPOINTS.REGISTER_BUYER, data);

export const registerSeller = (data: object): Promise<RegisterResponse> =>
  axiosInstance.post(AUTH_ENDPOINTS.REGISTER_SELLER, data);



export const loginUser = (
  credentials: LoginFormValues
): Promise<ApiResponse<AuthSuccessPayload>> =>
  axiosInstance.post(AUTH_ENDPOINTS.LOGIN, credentials);



export const verifyOtp = (
  payload: VerifyOtpPayload
): Promise<ApiResponse<AuthSuccessPayload>> =>
  axiosInstance.post(AUTH_ENDPOINTS.VERIFY_OTP, payload);

export const resendOtp = (payload: {
  email: string;
}): Promise<ApiResponse> =>
  axiosInstance.post(AUTH_ENDPOINTS.RESEND_OTP, payload);



export const forgotPassword = (payload: {
  email: string;
}): Promise<ApiResponse> =>
  axiosInstance.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, payload);

export const verifyResetOtp = (payload: {
  email: string;
  otp: string;
}): Promise<ApiResponse> =>
  axiosInstance.post(AUTH_ENDPOINTS.VERIFY_RESET_OTP, {
    email: payload.email,
    otp: payload.otp,
    otpCode: payload.otp,
  });

export const resetPassword = (payload: {
  email?: string;
  token?: string;
  password: string;
  confirmPassword?: string;
}): Promise<ApiResponse> =>
  axiosInstance.post(AUTH_ENDPOINTS.RESET_PASSWORD, payload);


export const getProfile = (): Promise<ApiResponse> =>
  axiosInstance.get(AUTH_ENDPOINTS.PROFILE);