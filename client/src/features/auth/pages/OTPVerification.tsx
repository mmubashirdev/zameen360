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
import { getErrorMessage } from "@shared/utils/errorHandler";
import {
  verifyOTP,
  resendResetOtp,
  clearAuthError,
  clearAuthSuccess,
  clearOtpVerified,
} from "../auth.slice";
import type { AppDispatch, RootState } from "../../../app/stores/store";
import styles from "../styles/otpVerification.module.css";

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

  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const savedExpiry = sessionStorage.getItem("otp_expiry_time");
    if (savedExpiry === "expired") {
      return 0;
    }
    if (savedExpiry) {
      const remaining = Math.max(0, Math.ceil((Number(savedExpiry) - Date.now()) / 1000));
      return remaining;
    }
    const expiry = Date.now() + 60 * 1000;
    sessionStorage.setItem("otp_expiry_time", String(expiry));
    return 60;
  });

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
  useEffect(() => {
    if (!apiError) return;

    setError(apiError);
    toast.error(apiError);
    dispatch(clearAuthError());

    const lowerError = apiError.toLowerCase();
    if (lowerError.includes("expired")) {
      setTimeLeft(0);
      setOtp("");
      sessionStorage.setItem("otp_expiry_time", "expired");
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
    sessionStorage.setItem("auth_flow_otp", otp);
    dispatch(clearOtpVerified());
    dispatch(clearAuthSuccess());
    sessionStorage.removeItem("otp_expiry_time");
    onNext();
  }, [otpVerified, onNext, dispatch, otp]);

  // ── Timer countdown ───────────────────────────────────
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // ── Auto-clear on expiry ──────────────────────────────
  useEffect(() => {
    if (timeLeft !== 0) return;

    setOtp("");
    // setError("Verification code has expired. Please request a new code.");
    sessionStorage.setItem("otp_expiry_time", "expired");
  }, [timeLeft]);

  const formatTime = (s: number): string => {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  const handleResend = useCallback(async () => {
    if (!email) {
      toast.error("Email missing. Please restart the process.");
      return;
    }

    setIsResending(true);
    setError("");
    setOtp("");

    try {
      await dispatch(resendResetOtp(email)).unwrap();
      const expiry = Date.now() + 60 * 1000;
      sessionStorage.setItem("otp_expiry_time", String(expiry));
      setTimeLeft(60);
      toast.success("New verification code sent to your email!");
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to resend code");
      toast.error(message);
      setError(message);
    } finally {
      setIsResending(false);
    }
  }, [email, dispatch]);

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
      const message = getErrorMessage(err, "Verification failed");

      setOtp("");
      setError(message);

      if (message.toLowerCase().includes("expired")) {
        setTimeLeft(0);
        sessionStorage.setItem("otp_expiry_time", "expired");
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
        className={styles.backBtn}
      >
        <ArrowLeft size={16} />
        Back to Login
      </button>

      <StepIndicator currentStep={2} />

      <div className={styles.headerBlock}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className={styles.iconWrapper}
        >
          <ShieldCheck size={26} />
        </motion.div>
        <h2 className={styles.title}>Verify Your Email</h2>
        <p className={styles.subtitle}>
          Enter the 6-digit code sent to
          <br />
          <span className={styles.emailHighlight}>{maskedEmail}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={expired ? styles.otpDisabled : ""}>
          <OTPInput
            length={6}
            value={otp}
            onChange={handleOtpChange}
            hasError={!!error || expired}
          />
        </div>

        {(error || expired) && (
          <p role="alert" className={styles.errorMsg}>
            <AlertCircle size={13} />
            {error || "Verification code has expired"}
          </p>
        )}

        <div className={styles.timerRow}>
          {expired ? (
            <span className={styles.expiredMsg}>
              <AlertCircle size={14} />
              Code Expired — Please request a new code
            </span>
          ) : (
            <>
              <Clock size={14} />
              <span>
                Code expires in{" "}
                <span className={styles.timerValue}>{formatTime(timeLeft)}</span>
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

        <p className={styles.footer}>
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={!expired || isResending}
            className={[
              styles.resendBtn,
              expired && !isResending
                ? styles.resendActive
                : styles.resendDisabled,
            ].join(" ")}
          >
            {isResending ? "Sending..." : "Resend Code"}
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}
