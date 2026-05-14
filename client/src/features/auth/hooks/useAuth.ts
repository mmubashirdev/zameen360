import { useCallback } from "react";
import { useAuthContext } from "../context/useAuthContext";
import {
  signupService,
  loginService,
  logoutService,
  verifyEmailService,
  resendVerificationOtpService,
} from "../services/authService";
import type {
  SignupFormValues,
  LoginFormValues,
  SignupServiceResult,
  LoginServiceResult,
  VerifyOtpPayload,
} from "../types/auth.types";

export function useAuth() {
  const ctx = useAuthContext();


  const signup = useCallback(
    async (formValues: SignupFormValues): Promise<SignupServiceResult> => {
      ctx.setLoading(true);
      ctx.setError(null);
      try {
        const result = await signupService(formValues);
        ctx.setLoading(false);
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Registration failed.";
        ctx.setError(message);
        throw err;
      }
    },
    [ctx]
  );


  const login = useCallback(
    async (credentials: LoginFormValues): Promise<LoginServiceResult> => {
      ctx.setLoading(true);
      ctx.setError(null);
      try {
        const result = await loginService(credentials);
        ctx.setUser(result.user, result.token);
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Login failed.";
        ctx.setError(message);
        throw err;
      }
    },
    [ctx]
  );


  const logout = useCallback((): void => {
    logoutService();
    ctx.logout();
  }, [ctx]);

  const verifyEmail = useCallback(
    async (payload: VerifyOtpPayload): Promise<LoginServiceResult> => {
      ctx.setLoading(true);
      ctx.setError(null);
      try {
        const result = await verifyEmailService(payload);
        ctx.setUser(result.user, result.token);
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Email verification failed.";
        ctx.setError(message);
        throw err;
      }
    },
    [ctx]
  );

  const resendVerificationOtp = useCallback(
    async (email: string): Promise<string> => {
      ctx.setError(null);
      return resendVerificationOtpService(email);
    },
    [ctx]
  );

  return {
    user: ctx.user,
    token: ctx.token,
    isAuthenticated: ctx.isAuthenticated,
    isLoading: ctx.isLoading,
    error: ctx.error,
    signup,
    login,
    verifyEmail,
    resendVerificationOtp,
    logout,
  };
}
