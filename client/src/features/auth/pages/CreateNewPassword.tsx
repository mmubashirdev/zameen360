import { useState, useMemo, useEffect } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, KeyRound, Lock, Eye, EyeOff, Check, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import AuthButton from "../components/AuthButton";
import StepIndicator from "../components/StepIndicator";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { resetPassword, clearAuthError, clearAuthSuccess } from "../auth.slice";
import type { AppDispatch, RootState } from "../../../app/stores/store";

interface CreateNewPasswordProps {
  onNext: () => void;
  onBack: () => void;
  email?: string;
}

const CRITERIA: Array<(p: string) => boolean> = [
  (p) => p.length >= 8,
  (p) => /[a-z]/.test(p) && /[A-Z]/.test(p),
  (p) => /\d/.test(p),
  (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
];

export default function CreateNewPassword({
  onNext,
  onBack,
  email,
}: CreateNewPasswordProps) {
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const {
    loading,
    error: apiError,
    successMessage,
    emailForReset,
  } = useSelector((state: RootState) => state.auth);

  const effectiveEmail = email || emailForReset;

  const allRequirementsMet = useMemo(
    () => CRITERIA.every((c) => c(password)),
    [password],
  );
  const passwordsMatch = password.length > 0 && password === confirm;
  const canSubmit = allRequirementsMet && passwordsMatch;

  useEffect(() => {
    if (apiError) {
      toast.error(apiError);
      dispatch(clearAuthError());
    }
  }, [apiError, dispatch]);

  useEffect(() => {
    if (successMessage === "Password reset successfully") {
      toast.success(successMessage);
      dispatch(clearAuthSuccess());
      onNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successMessage]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (!effectiveEmail) {
      toast.error("Email is missing. Please restart the process.");
      return;
    }
    dispatch(resetPassword({ email: effectiveEmail, password }));
  };

  return (
    <AuthLayout>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <StepIndicator currentStep={3} />

      <div className="text-center mb-7">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="w-16 h-16 mx-auto mb-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center"
        >
          <KeyRound size={26} className="text-blue-600" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Create New Password
        </h2>
        <p className="text-sm text-gray-500">
          Your new password must be different from your previous password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* New Password */}
        <div>
          <label
            htmlFor="new-password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock size={18} />
            </span>
            <input
              id="new-password"
              name="new-password"
              type={showPwd ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full pl-11 pr-11 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              aria-label={showPwd ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <PasswordStrengthMeter password={password} />
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock size={18} />
            </span>
            <input
              id="confirm-password"
              name="confirm-password"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={loading}
              className={[
                "w-full pl-11 pr-11 py-3 text-sm rounded-xl border outline-none transition-all duration-200 bg-gray-50",
                confirm.length === 0
                  ? "border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  : passwordsMatch
                    ? "border-green-400 bg-green-50/50 focus:ring-4 focus:ring-green-100"
                    : "border-red-400 bg-red-50/50 focus:ring-4 focus:ring-red-100",
              ].join(" ")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {confirm.length > 0 && (
            <div
              className={[
                "mt-2 flex items-center gap-1.5 text-xs font-medium",
                passwordsMatch ? "text-green-600" : "text-red-600",
              ].join(" ")}
            >
              {passwordsMatch ? (
                <>
                  <Check size={14} strokeWidth={3} /> Passwords match
                </>
              ) : (
                <>
                  <X size={14} strokeWidth={2.5} /> Passwords do not match
                </>
              )}
            </div>
          )}
        </div>

        <AuthButton
          type="submit"
          loading={loading}
          disabled={!canSubmit || loading}
          className="mt-2"
        >
          Reset Password
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
