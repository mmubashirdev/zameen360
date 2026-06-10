import {
  registerBuyer,
  loginUser,
  verifyOtp,
  resendOtp,
} from "../api/authApi";
import { STORAGE_KEYS } from "../constants/authConstants";
import { getErrorMessage } from "@shared/utils/errorHandler";
import type {
  AuthSuccessPayload,
  LoginFormValues,
  LoginServiceResult,
  ResendOtpServiceResult,
  SignupPayload,
  SignupServiceResult,
  User,
  VerifyOtpPayload,
} from "../types/auth.types";

// ─── Storage Helpers ──────────────────────────────────────────────────────────

const persistAuth = (token: string, user: User) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  // Note: User data should NOT be stored in localStorage for security reasons
};

export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

export const getStoredUser = (): User | null => {
  // User data is not stored in localStorage for security reasons
  // Fetch user data from the API after token validation
  return null;
};

export const getStoredToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN);

const normalizeUser = (user: AuthSuccessPayload["user"]): User => ({
  userId: user.userId || user.id || "",
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
});

const getError = (error: unknown, fallback: string) => {
  const data =
    error && typeof error === "object" && "response" in error
      ? (
          error as {
            response?: {
              data?: unknown;
            };
          }
        ).response?.data
      : undefined;
  const message = getErrorMessage(error, fallback);
  const err = new Error(message) as Error & Record<string, unknown>;
  if (data && typeof data === "object") {
    Object.assign(err, data);
  }
  if (error && typeof error === "object") {
    Object.assign(err, error);
  }
  return err;
};

// sign up ???

export const handleSignup = async (
  data: SignupPayload,
): Promise<SignupServiceResult> => {
  try {
    // Always register as BUYER — user can switch to seller after signup
    const response = await registerBuyer(data);

    if (!response?.data?.userId || !response.data.email) {
      throw new Error("Invalid signup response structure");
    }

    return {
      data: response.data,
      message: response.message,
    };
  } catch (error: unknown) {
    throw getError(error, "Signup failed");
  }
};

// ??? login

export const handleLogin = async (
  data: LoginFormValues,
): Promise<LoginServiceResult> => {
  try {
    const response = await loginUser(data);
    const authPayload = response?.data;

    if (!authPayload?.user || !authPayload.accessToken) {
      throw new Error("Invalid login response structure");
    }

    const user = normalizeUser(authPayload.user);
    persistAuth(authPayload.accessToken, user);

    return {
      user,
      token: authPayload.accessToken,
      refreshToken: authPayload.refreshToken,
      message: response.message,
    };
  } catch (error: unknown) {
    throw getError(error, "Login failed");
  }
};

// verify email

export const handleVerifyEmail = async (
  payload: VerifyOtpPayload,
): Promise<LoginServiceResult> => {
  try {
    const response = await verifyOtp(payload);
    const authPayload = response?.data;

    if (!authPayload?.user || !authPayload.accessToken) {
      throw new Error("Invalid verification response structure");
    }

    const user = normalizeUser(authPayload.user);
    persistAuth(authPayload.accessToken, user);

    return {
      user,
      token: authPayload.accessToken,
      refreshToken: authPayload.refreshToken,
      message: response.message,
    };
  } catch (error: unknown) {
    throw getError(error, "Verification failed");
  }
};

// resend otp

export const handleResendOtp = async (
  email: string,
): Promise<ResendOtpServiceResult> => {
  try {
    const response = await resendOtp({ email });
    return {
      message: response.message,
      data: response.data,
    };
  } catch (error: unknown) {
    throw getError(error, "Failed to resend OTP");
  }
};

export const handleLogout = () => clearAuth();
