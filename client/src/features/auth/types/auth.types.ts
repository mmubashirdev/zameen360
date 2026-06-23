// ─── User & Role Types ────────────────────────────────────────────────────────

export type UserRole = "BUYER" | "SELLER" | "SOCIETY_OWNER" | "ADMIN";

export interface User {
  id?: string;
  userId: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  role: UserRole;
  isVerified: boolean;
} 

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ─── Signup Types ─────────────────────────────────────────────────────────────

export interface SignupFormValues {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  password: string;
  confirmPassword: string;
}

export interface SignupPayload {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  password: string;
  confirmPassword: string;
}

// ─── Login Types ──────────────────────────────────────────────────────────────

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthSuccessPayload {
  user: {
    id?: string;
    userId?: string;
    fullName: string;
    email: string;
    role: UserRole;
    isVerified: boolean;
  };
  accessToken: string;
  refreshToken?: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  token?: string;
  requiresVerification?: boolean;
}

export interface RegisterResponseData {
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  token?: string;
  otpExpiresAt?: string;
  resendAvailableAt?: string;
}

export type RegisterResponse = ApiResponse<RegisterResponseData>;

export interface OtpDeliveryData {
  otpExpiresAt?: string;
  resendAvailableAt?: string;
}

// ─── Context Types ────────────────────────────────────────────────────────────

export interface AuthContextType extends AuthState {
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null, token?: string) => void;
  setError: (error: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

// ─── Toast Types ──────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
  removing: boolean;
}

export interface ToastHook {
  toasts: Toast[];
  addToast: (
    type: ToastType,
    title: string,
    message?: string,
    duration?: number
  ) => void;
  removeToast: (id: number) => void;
  success: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  info: (title: string, message?: string, duration?: number) => void;
}

// ─── City Type ────────────────────────────────────────────────────────────────

export interface City {
  value: string;
  label: string;
}

// ─── Password Strength ────────────────────────────────────────────────────────

export interface PasswordStrengthResult {
  score: number;
  label: string;
  level: "weak" | "fair" | "good" | "strong" | "";
}

// ─── Service Return Types ─────────────────────────────────────────────────────

export interface SignupServiceResult {
  data: RegisterResponseData;
  message: string;
}

export interface ResendOtpServiceResult {
  message: string;
  data?: OtpDeliveryData;
}

export interface LoginServiceResult {
  user: User;
  token: string;
  message: string;
  refreshToken?: string;
}

export interface VerifyOtpPayload {
  email: string;
  otpCode: string;
}
