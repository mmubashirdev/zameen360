import { useContext, useState } from "react";
import { AuthContext } from "../context/authContextStore";
import {
  handleSignup,
  handleLogin,
  handleVerifyEmail,
  handleResendOtp,
} from "../services/authService";
import type {
  AuthContextType,
  LoginFormValues,
  SignupPayload,
  VerifyOtpPayload,
} from "../types/auth.types";
import { getErrorMessage } from "@shared/utils/errorHandler";

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within <AuthProvider>");
  return ctx;
}

export function detectErrorField(message: string): "email" | "password" | "phone" | "general" {
  const lower = message.toLowerCase();
  if (lower.includes("email") && (lower.includes("already") || lower.includes("exist") || lower.includes("invalid"))) return "email";
  if (lower.includes("password")) return "password";
  if (lower.includes("phone")) return "phone";
  return "general";
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const hasAuthSession = (
    value: unknown,
  ): value is { user: AuthContextType["user"]; token: string } => {
    return (
      typeof value === "object" &&
      value !== null &&
      "user" in value &&
      "token" in value &&
      typeof (value as { token?: unknown }).token === "string"
    );
  };

  const execute = async <TArgs, TResult>(
    serviceFn: (args: TArgs) => Promise<TResult>,
    args: TArgs,
    updateContext?: boolean,
  ): Promise<TResult> => {
    setIsLoading(true);
    try {
      const result = await serviceFn(args);
      if (updateContext && hasAuthSession(result)) {
        ctx?.setUser?.(result.user, result.token);
      }
      ctx?.setError?.(null);
      return result;
    } catch (error: unknown) {
      ctx?.setError?.(getErrorMessage(error));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signup: (data: SignupPayload) => execute(handleSignup, data),
    login: (data: LoginFormValues) => execute(handleLogin, data, true),
    verifyEmail: (data: VerifyOtpPayload) =>
      execute(handleVerifyEmail, data, true),
    resendVerificationOtp: (email: string) => execute(handleResendOtp, email),
    isLoading,
  };
}
