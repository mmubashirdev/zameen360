import {
  registerBuyer,
  registerSeller,
  loginUser,
  verifyOtp,
  resendOtp,
} from "../api/authApi";
import { USER_ROLES, STORAGE_KEYS } from "../constants/authConstants";
import type {
  SignupFormValues,
  SignupServiceResult,
  LoginFormValues,
  LoginServiceResult,
  User,
  AuthSuccessPayload,
  VerifyOtpPayload,
} from "../types/auth.types";

// ─── Storage Helpers ──────────────────────────────────────────────────────────

const persistAuth = (token: string, user: User): void => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const clearAuth = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

export const getStoredToken = (): string | null =>
  localStorage.getItem(STORAGE_KEYS.TOKEN);

const normalizeUser = (
  user: AuthSuccessPayload["user"] | User
): User => ({
  userId:
    ("userId" in user && user.userId) || ("id" in user && user.id)
      ? (("userId" in user && user.userId) || ("id" in user && user.id) || "")
      : "",
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
});

// ─── FormData Builder ─────────────────────────────────────────────────────────



const buildSignupFormData = (data: SignupFormValues): FormData => {
  const formData = new FormData();

  formData.append("fullName", data.fullName.trim());
  formData.append("email", data.email.trim().toLowerCase());
  formData.append("phone", data.phone.trim());
  formData.append("city", data.city);
  formData.append("password", data.password);
  formData.append("confirmPassword", data.confirmPassword);
  formData.append("role", data.role.toUpperCase());

 

  return formData;
};

// ─── Signup Service ───────────────────────────────────────────────────────────

/**
 * Builds FormData, calls role-specific endpoint,
 * persists token if returned, and returns normalized result.
 */
export const signupService = async (
  formValues: SignupFormValues
): Promise<SignupServiceResult> => {
  const role = formValues.role.toUpperCase();
  const formData = buildSignupFormData(formValues);

  // Route to correct endpoint based on role
  const apiFn =
    role === USER_ROLES.SELLER ? registerSeller : registerBuyer;

  /*
    Backend response shape:
    {
      success: true,
      message: "Registered successfully. Please verify your email.",
      data: { userId, fullName, email, role, isVerified }
    }
  */
  const response = await apiFn(formData);

  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Registration failed.");
  }

  // Persist auth if token is returned (future-proof)
  if (response.token) {
    persistAuth(response.token, normalizeUser(response.data));
  }

  return {
    user: response.data,
    message: response.message,
  };
};

// ─── Login Service ────────────────────────────────────────────────────────────

export const loginService = async (
  credentials: LoginFormValues
): Promise<LoginServiceResult> => {
  const response = await loginUser(credentials);

  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Login failed.");
  }

  const user = normalizeUser(response.data.user);
  const token = response.data.accessToken;

  persistAuth(token, user);

  return { user, token, message: response.message };
};

export const verifyEmailService = async (
  payload: VerifyOtpPayload
): Promise<LoginServiceResult> => {
  const response = await verifyOtp(payload);

  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Verification failed.");
  }

  const user = normalizeUser(response.data.user);
  const token = response.data.accessToken;

  persistAuth(token, user);

  return { user, token, message: response.message };
};

export const resendVerificationOtpService = async (
  email: string
): Promise<string> => {
  const response = await resendOtp({ email });

  if (!response.success) {
    throw new Error(response.message ?? "Failed to resend OTP.");
  }

  return response.message;
};

// ─── Logout Service ───────────────────────────────────────────────────────────

export const logoutService = (): void => {
  clearAuth();
};
