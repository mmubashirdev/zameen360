import { useContext, useState } from "react";
import { AuthContext } from "../context/authContextStore";
import {
  registerBuyer,
  registerSeller,
  loginUser,
  verifyOtp,
  resendOtp,
} from "../api/authApi";
import { STORAGE_KEYS } from "../constants/authConstants";
import type {
  AuthContextType,
  SignupServiceResult,
  LoginServiceResult,
  LoginFormValues,
  User,
  VerifyOtpPayload,
} from "../types/auth.types";
import type { SignupSchemaType } from "../validations/signupSchema";

// ─── useAuthContext ───────────────────────────────────────────────────────────

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within <AuthProvider>");
  }
  return ctx;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "string") return error;

  const err = error as {
    message?: string;
    status?: number;
    response?: { data?: { message?: string } };
    data?: { message?: string };
  };

  const msg =
    err?.message ??
    err?.response?.data?.message ??
    err?.data?.message ??
    fallback;

  return String(msg);
}

function getRequiresVerification(error: unknown): boolean {
  const err = error as {
    requiresVerification?: boolean;
    response?: { data?: { requiresVerification?: boolean } };
  };

  return Boolean(
    err?.requiresVerification ?? err?.response?.data?.requiresVerification
  );
}

// ─── Detect which field caused the error ──────────────────────────────────────

export function detectErrorField(
  message: string
): "email" | "password" | "phone" | "general" {
  const lower = message.toLowerCase();

  if (
    lower.includes("email") &&
    (lower.includes("already") ||
      lower.includes("exist") ||
      lower.includes("registered") ||
      lower.includes("invalid email"))
  ) {
    return "email";
  }

  if (lower.includes("password")) return "password";
  if (lower.includes("phone")) return "phone";

  return "general";
}

// ─── useAuth ──────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  // ── Signup ────────────────────────────────────────────────────────────────

  const signup = async (
    data: SignupSchemaType
  ): Promise<SignupServiceResult> => {
    setIsLoading(true);

    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: data.role.toUpperCase(),
      };

      const response =
        data.role === "buyer"
          ? await registerBuyer(payload)
          : await registerSeller(payload);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Registration failed.");
      }

      ctx?.setError?.(null);

      return {
        user: response.data,
        message: response.message,
      };
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Registration failed. Please try again."
      );
      ctx?.setError?.(message);
      throw new Error(message, { cause: error });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Login ─────────────────────────────────────────────────────────────────

  const login = async (
    data: LoginFormValues
  ): Promise<LoginServiceResult> => {
    setIsLoading(true);

    try {
      const response = await loginUser({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      if (!response.success || !response.data) {
        throw {
          message: response.message || "Login failed.",
          requiresVerification: response.requiresVerification ?? false,
        };
      }

      const apiUser = response.data.user;

      const normalizedUser: User = {
        userId: apiUser.userId ?? apiUser.id ?? "",
        fullName: apiUser.fullName,
        email: apiUser.email,
        role: apiUser.role,
        isVerified: apiUser.isVerified,
      };

      const token = response.data.accessToken;

      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(normalizedUser));

      ctx?.setUser?.(normalizedUser, token);
      ctx?.setError?.(null);

      return {
        user: normalizedUser,
        token,
        message: response.message || "Login successful.",
      };
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Login failed. Please try again."
      );
      const requiresVerification = getRequiresVerification(error);

      ctx?.setError?.(message);

      throw { message, requiresVerification };
    } finally {
      setIsLoading(false);
    }
  };

  // ── Verify Email ──────────────────────────────────────────────────────────

  const verifyEmail = async (
    payload: VerifyOtpPayload
  ): Promise<LoginServiceResult> => {
    setIsLoading(true);

    try {
      const response = await verifyOtp(payload);

      if (!response.success) {
        throw new Error(response.message || "Verification failed.");
      }

      const apiUser = response.data?.user;
      const token = response.data?.accessToken ?? "";

      const normalizedUser: User = {
        userId: apiUser?.userId ?? apiUser?.id ?? "",
        fullName: apiUser?.fullName ?? "",
        email: apiUser?.email ?? payload.email,
        role: apiUser?.role ?? "BUYER",
        isVerified: true,
      };

      if (token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(normalizedUser));
        ctx?.setUser?.(normalizedUser, token);
      }

      ctx?.setError?.(null);

      return {
        user: normalizedUser,
        token,
        message: response.message || "Email verified successfully.",
      };
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Verification failed. Please try again."
      );
      ctx?.setError?.(message);
      throw new Error(message, { cause: error });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resend Verification OTP ───────────────────────────────────────────────

  const resendVerificationOtp = async (email: string): Promise<string> => {
    setIsLoading(true);

    try {
      const response = await resendOtp({
        email: email.trim().toLowerCase(),
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to resend code.");
      }

      return response.message || "Verification code sent successfully.";
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Failed to resend code. Please try again."
      );
      throw new Error(message, { cause: error });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signup,
    login,
    verifyEmail,
    resendVerificationOtp,
    isLoading,
  };
}