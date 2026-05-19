import { useContext, useState } from "react";
import { AuthContext } from "../context/authContextStore";
import {
  handleSignup,
  handleLogin,
  handleVerifyEmail,
  handleResendOtp,
} from "../services/authService";
import type { AuthContextType } from "../types/auth.types";

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
    } catch (error: any) {
      ctx?.setError?.(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signup: (data: any) => execute(handleSignup, data),
    login: (data: any) => execute(handleLogin, data, true),
    verifyEmail: (data: any) => execute(handleVerifyEmail, data, true),
    resendVerificationOtp: (email: string) => execute(handleResendOtp, email),
    isLoading,
  };
}
