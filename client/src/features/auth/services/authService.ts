import {
  registerBuyer,
  registerSeller,
  loginUser,
  verifyOtp,
  resendOtp,
} from "../api/authApi";
import { USER_ROLES, STORAGE_KEYS } from "../constants/authConstants";
import type { User } from "../types/auth.types";



// ─── Storage Helpers ──────────────────────────────────────────────────────────

const persistAuth = (token: string, user: User) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getStoredToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN);

const normalizeUser = (user: any): User => ({
  userId: user.userId || user.id || "",
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
});

const getError = (error: any, fallback: string) => {
  const data = error.response?.data;
  const message = data?.message || error.message || fallback;
  const err = new Error(message) as any;
  if (data && typeof data === "object") {
    Object.assign(err, data);
  }
  return err;
};




// sign up ???

export const handleSignup = async (data: any) => {
  try {
    const isSeller = data.role?.toUpperCase() === USER_ROLES.SELLER;
    const response = await (isSeller ? registerSeller(data) : registerBuyer(data));

    if (response?.data?.token) {
      persistAuth(response.data.token, normalizeUser(response.data));
    } else {
      throw new Error("Invalid response structure: Missing token or data");
    }

    return response;
  } catch (error: any) {
    throw getError(error, "Signup failed");
  }
};





// ??? login 

export const handleLogin = async (data: any) => {
  try {
    const response = await loginUser(data);

    if (response?.data?.user && response?.data?.accessToken) {
      const user = normalizeUser(response.data.user);
      persistAuth(response.data.accessToken, user);
    } else {
      throw new Error("Invalid response structure: Missing user or accessToken");
    }

    return response;
  } catch (error: any) {
    throw getError(error, "Login failed");
  }
};


// verify email 


export const handleVerifyEmail = async (payload: any) => {
  try {
    const response = await verifyOtp(payload);

    if (response?.data?.user && response?.data?.accessToken) {
      const user = normalizeUser(response.data.user);
      persistAuth(response.data.accessToken, user);
    } else {
      throw new Error("Invalid response structure: Missing user or accessToken");
    }

    return response;
  } catch (error: any) {
    throw getError(error, "Verification failed");
  }
};



// resend otp

export const handleResendOtp = async (email: string) => {
  try {
    const response = await resendOtp({ email });
    return response.message;
  } catch (error: any) {
    throw getError(error, "Failed to resend OTP");
  }
};



export const handleLogout = () => clearAuth();
