import { useState, useMemo, useEffect } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, KeyRound, Lock, Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import StepIndicator from "../components/StepIndicator";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { resetPassword, clearAuthError, clearAuthSuccess } from "../auth.slice";
import type { AppDispatch, RootState } from "../../../app/stores/store";
import styles from "../styles/createNewPassword.module.css";

interface CreateNewPasswordProps {
  onNext: () => void;
  onBack: () => void;
  onBackToLogin: () => void;
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
  onBackToLogin,
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

  const getConfirmInputClass = () => {
    if (confirm.length === 0) return styles.input;
    return [styles.input, passwordsMatch ? styles.inputMatch : styles.inputMismatch].join(" ");
  };

  return (
    <AuthLayout>
      {/* Back to Login */}
      <button
        type="button"
        onClick={onBackToLogin}
        className={styles.backBtn}
      >
        <ArrowLeft size={16} />
        Back to Login
      </button>

      <StepIndicator currentStep={3} />

      {/* Header */}
      <div className={styles.headerBlock}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className={styles.iconWrapper}
        >
          <KeyRound size={22} />
        </motion.div>
        <h2 className={styles.title}>Create New Password</h2>
        <p className={styles.subtitle}>
          Your new password must be different from previous.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* New Password */}
        <div className={styles.fieldGroup}>
          <label htmlFor="new-password" className={styles.label}>
            New Password
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>
              <Lock size={17} />
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
              className={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              aria-label={showPwd ? "Hide password" : "Show password"}
              className={styles.toggleBtn}
            >
              {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          <PasswordStrengthMeter password={password} />
        </div>

        {/* Confirm Password */}
        <div className={styles.fieldGroup}>
          <label htmlFor="confirm-password" className={styles.label}>
            Confirm New Password
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>
              <Lock size={17} />
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
              className={getConfirmInputClass()}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
              className={styles.toggleBtn}
            >
              {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {confirm.length > 0 && (
            <div
              className={[
                styles.matchFeedback,
                passwordsMatch ? styles.matchOk : styles.matchFail,
              ].join(" ")}
            >
              {passwordsMatch ? (
                <>
                  <Check size={13} strokeWidth={3} /> Passwords match
                </>
              ) : (
                <>
                  <X size={13} strokeWidth={2.5} /> Passwords do not match
                </>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className={styles.submitBtn}
        >
          {loading ? (
            <>
              <Loader2 size={18} className={styles.btnSpinner} />
              Processing...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}