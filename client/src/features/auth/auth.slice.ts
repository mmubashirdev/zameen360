import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import * as authApi from "./api/authApi";

export interface AuthState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  emailForReset: string | null;
  otpVerified: boolean;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  successMessage: null,
  emailForReset: null,
  otpVerified: false,
};

// Helper to extract API error message
const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      fallback
    );
  }
  return error instanceof Error ? error.message : fallback;
};

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPassword({ email });
      return { response, email };
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Failed to send OTP"));
    }
  },
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (data: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyResetOtp(data);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Invalid OTP"));
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.resetPassword(data);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to reset password"),
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    clearAuthSuccess: (state) => {
      state.successMessage = null;
    },
    setEmailForReset: (state, action: PayloadAction<string>) => {
      state.emailForReset = action.payload;
    },
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.emailForReset = null;
      state.otpVerified = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "OTP sent to your email";
        state.emailForReset = action.payload.email;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "OTP verified successfully";
        state.otpVerified = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Password reset successfully";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearAuthError,
  clearAuthSuccess,
  setEmailForReset,
  resetAuthState,
} = authSlice.actions;
export default authSlice.reducer;
