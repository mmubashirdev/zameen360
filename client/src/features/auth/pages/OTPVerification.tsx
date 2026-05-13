import { useState, useEffect, useMemo } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Clock, AlertCircle } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import AuthButton from "../components/AuthButton";
import StepIndicator from "../components/StepIndicator";
import OTPInput from "../components/OTPInput";

interface OTPVerificationProps {
  onNext: () => void;
  onBack: () => void;
  email: string;
}

export default function OTPVerification({
  onNext,
  onBack,
  email,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const maskedEmail: string = useMemo(() => {
    if (!email) return "your email";
    const [name, domain] = email.split("@");
    if (!domain) return email;
    const visible = name.slice(0, 3);
    return `${visible}${"*".repeat(Math.max(name.length - 3, 4))}@${domain}`;
  }, [email]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const formatTime = (s: number): string => {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  const handleResend = () => {
    setTimeLeft(60);
    setOtp("");
    setError("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 1100);
  };

  const handleOtpChange = (val: string) => {
    setOtp(val);
    if (error) setError("");
  };

  const expired = timeLeft <= 0;

  return (
    <AuthLayout>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 mb-6 transition-colors"
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
          <ShieldCheck size={26} className="text-blue-600" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Verify Your Email
        </h2>
        <p className="text-sm text-gray-500">
          Enter the 6-digit code sent to
          <br />
          <span className="font-semibold text-blue-700">{maskedEmail}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <OTPInput
          length={6}
          value={otp}
          onChange={handleOtpChange}
          hasError={!!error}
        />

        {error && (
          <p
            role="alert"
            className="flex items-center justify-center gap-1.5 text-xs text-red-600"
          >
            <AlertCircle size={13} /> {error}
          </p>
        )}

        <div className="flex items-center justify-center gap-1.5 text-sm">
          {expired ? (
            <span className="text-red-600 font-medium">Code expired</span>
          ) : (
            <>
              <Clock size={14} className="text-gray-500" />
              <span className="text-gray-600">
                Code expires in{" "}
                <span className="font-semibold text-blue-600">
                  {formatTime(timeLeft)}
                </span>
              </span>
            </>
          )}
        </div>

        <AuthButton type="submit" loading={loading} disabled={otp.length !== 6}>
          Verify Code
        </AuthButton>

        <p className="text-center text-sm text-gray-500">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={!expired}
            className={[
              "font-semibold transition-colors",
              expired
                ? "text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                : "text-gray-400 cursor-not-allowed",
            ].join(" ")}
          >
            Resend Code
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}
