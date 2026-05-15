import { useState, useEffect, useMemo, useCallback } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Clock, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import AuthButton from "../components/AuthButton";
import StepIndicator from "../components/StepIndicator";
import OTPInput from "../components/OTPInput";
import {
  verifyOTP,
  resendOtp,
  clearAuthError,
  clearAuthSuccess,
  clearOtpVerified,
} from "../auth.slice";
import type { AppDispatch, RootState } from "../../../app/stores/store";

interface OTPVerificationProps {
  onNext: () => void;
  onBack: () => void;
  onBackToLogin: () => void;
  email: string;
}

export default function OTPVerification({
  onNext,
  onBackToLogin,
  email,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [error, setError] = useState<string>("");
  const [isResending, setIsResending] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const {
    loading,
    error: apiError,
    otpVerified,
  } = useSelector((state: RootState) => state.auth);

  const expired = timeLeft <= 0;

  const maskedEmail: string = useMemo(() => {
    if (!email) return "your email";
    const [name, domain] = email.split("@");
    if (!domain) return email;
    const visible = name.slice(0, 3);
    return `${visible}${"*".repeat(Math.max(name.length - 3, 4))}@${domain}`;
  }, [email]);

  // ── Handle API errors ─────────────────────────────────
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (!apiError) return;

    setError(apiError);
    toast.error(apiError);
    dispatch(clearAuthError());

    const lowerError = apiError.toLowerCase();
    if (lowerError.includes("expired")) {
      setTimeLeft(0);
      setOtp("");
    } else if (
      lowerError.includes("invalidated") ||
      lowerError.includes("no longer valid")
    ) {
      setOtp("");
    }
  }, [apiError, dispatch]);

  // ── Handle verify success ─────────────────────────────
  useEffect(() => {
    if (!otpVerified) return;

    toast.success("Email verified!");
    dispatch(clearOtpVerified());
    dispatch(clearAuthSuccess());
    onNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpVerified]);

  // ── Timer countdown ───────────────────────────────────
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // ── Auto-clear on expiry ──────────────────────────────
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (timeLeft !== 0) return;

    setOtp("");
    setError("Verification code has expired. Please request a new code.");
  }, [timeLeft]);

  const formatTime = (s: number): string => {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  // ✅ Resend OTP
  const handleResend = useCallback(async () => {
    if (!email) {
      toast.error("Email missing. Please restart the process.");
      return;
    }

    setIsResending(true);
    setError("");
    setOtp("");

    try {
      await dispatch(resendOtp(email)).unwrap();
      setTimeLeft(60);
      toast.success("New verification code sent to your email!");
    } catch (err: unknown) {
      const message =
        typeof err === "string"
          ? err
          : err instanceof Error
          ? err.message
          : "Failed to resend code";
      toast.error(message);
      setError(message);
    } finally {
      setIsResending(false);
    }
  }, [email, dispatch]);

  // ✅ Verify OTP
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (expired) {
      setError("Verification code has expired. Please request a new code.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    try {
      await dispatch(verifyOTP({ email, otp })).unwrap();
    } catch (err: unknown) {
      const message =
        typeof err === "string"
          ? err
          : err instanceof Error
          ? err.message
          : "Verification failed";

      setOtp("");
      setError(message);

      if (message.toLowerCase().includes("expired")) {
        setTimeLeft(0);
      }
    }
  };

  const handleOtpChange = (val: string) => {
    if (expired) {
      setError("Verification code has expired. Please request a new code.");
      return;
    }
    setOtp(val);
    if (error) setError("");
  };

  return (
    <AuthLayout>
      <button
        type="button"
        onClick={onBackToLogin}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-900 hover:text-blue-950 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Login
      </button>

      <StepIndicator currentStep={2} />

      <div className="text-center mb-7">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="w-16 h-16 mx-auto mb-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center"
        >
          <ShieldCheck size={26} className="text-blue-900" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Verify Your Email
        </h2>
        <p className="text-sm text-gray-500">
          Enter the 6-digit code sent to
          <br />
          <span className="font-bold text-blue-900">{maskedEmail}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={expired ? "opacity-50 pointer-events-none" : ""}>
          <OTPInput
            length={6}
            value={otp}
            onChange={handleOtpChange}
            hasError={!!error || expired}
          />
        </div>

        {(error || expired) && (
          <p
            role="alert"
            className="flex items-center justify-center gap-1.5 text-xs text-red-600 font-medium"
          >
            <AlertCircle size={13} />
            {error || "Verification code has expired"}
          </p>
        )}

        <div className="flex items-center justify-center gap-1.5 text-sm">
          {expired ? (
            <span className="flex items-center gap-1.5 text-red-600 font-bold">
              <AlertCircle size={14} />
              Code Expired - Please request a new code
            </span>
          ) : (
            <>
              <Clock size={14} className="text-gray-500" />
              <span className="text-gray-600">
                Code expires in{" "}
                <span className="font-bold text-blue-900">
                  {formatTime(timeLeft)}
                </span>
              </span>
            </>
          )}
        </div>

        <AuthButton
          type="submit"
          loading={loading && !isResending}
          disabled={otp.length !== 6 || expired || loading}
        >
          {expired ? "Code Expired" : "Verify Code"}
        </AuthButton>

        <p className="text-center text-sm text-gray-600">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={!expired || isResending}
            className={[
              "font-bold transition-colors",
              expired && !isResending
                ? "text-blue-900 hover:text-blue-950 hover:underline cursor-pointer"
                : "text-gray-400 cursor-not-allowed",
            ].join(" ")}
          >
            {isResending ? "Sending..." : "Resend Code"}
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}