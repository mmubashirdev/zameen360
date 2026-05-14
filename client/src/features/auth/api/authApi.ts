import axiosInstance from "@shared/lib/axiosInstance";
import { AUTH_ENDPOINTS } from "../constants/authConstants";
import type {
  RegisterResponse,
  ApiResponse,
  LoginFormValues,
  AuthSuccessPayload,
  VerifyOtpPayload,
} from "../types/auth.types";



export const registerUser = (
  formData: FormData
): Promise<RegisterResponse> =>
  axiosInstance.post(AUTH_ENDPOINTS.REGISTER, formData);



export const registerBuyer = (
  formData: FormData
): Promise<RegisterResponse> =>
  axiosInstance.post(AUTH_ENDPOINTS.REGISTER_BUYER, formData);



export const registerSeller = (
  formData: FormData
): Promise<RegisterResponse> =>
  axiosInstance.post(AUTH_ENDPOINTS.REGISTER_SELLER, formData);




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
  axiosInstance.post(AUTH_ENDPOINTS.VERIFY_RESET_OTP, payload);

export const resetPassword = (payload: {
  email?: string;
  token?: string;
  password: string;
  confirmPassword?: string;
}): Promise<ApiResponse> =>
  axiosInstance.post(AUTH_ENDPOINTS.RESET_PASSWORD, payload);



export const getProfile = (): Promise<ApiResponse> =>
  axiosInstance.get(AUTH_ENDPOINTS.PROFILE);
