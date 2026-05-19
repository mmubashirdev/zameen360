import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import * as authApi from "./api/authApi";
import { getErrorMessage } from "@shared/utils/errorHandler";

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

// ─── Forgot Password ─────────────────────────────────────────────────────────

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPassword({ email });
      return { response, email };
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Failed to send OTP"));
    }
  }
);

// ─── Resend OTP (NEW) ────────────────────────────────────────────────────────

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authApi.resendOtp({ email });
      return response;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Failed to resend OTP"));
    }
  }
);

export const resendResetOtp = createAsyncThunk(
  "auth/resendResetOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authApi.resendResetOtp({ email });
      return response;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Failed to resend OTP"));
    }
  }
);

// ─── Verify OTP ──────────────────────────────────────────────────────────────

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (data: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyResetOtp(data);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Invalid OTP"));
    }
  }
);

// ─── Reset Password ──────────────────────────────────────────────────────────

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const otpCode = sessionStorage.getItem("auth_flow_otp") || "";
      const response = await authApi.resetPassword({
        email: data.email,
        token: otpCode,
        password: data.password,
      });
      sessionStorage.removeItem("auth_flow_otp");
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to reset password")
      );
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

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
    clearOtpVerified: (state) => {
      state.otpVerified = false;
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

      // ✅ Resend OTP (NEW)
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "New OTP sent to your email";
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(resendResetOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resendResetOtp.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "New OTP sent to your email";
      })
      .addCase(resendResetOtp.rejected, (state, action) => {
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
        state.otpVerified = false;
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
  clearOtpVerified,
  setEmailForReset,
  resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;
