import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Mail, Send, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import AuthButton from "../components/AuthButton";
import {
  forgotPassword,
  clearAuthError,
  clearAuthSuccess,
} from "../auth.slice";
import type { AppDispatch, RootState } from "../../../app/stores/store";
import styles from "../styles/forgotPassword.module.css";

interface ForgotPasswordProps {
  onNext: () => void;
  setEmail: (email: string) => void;
  onBack: () => void;
}

export default function ForgotPassword({
  onNext,
  setEmail,
  onBack,
}: ForgotPasswordProps) {
  const [emailLocal, setEmailLocal] = useState<string>("");
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  const {
    loading,
    error: apiError,
    successMessage,
  } = useSelector((state: RootState) => state.auth);

  const validateEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  useEffect(() => {
    if (apiError) {
      toast.error(apiError);
      dispatch(clearAuthError());
    }
  }, [apiError, dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearAuthSuccess());
      setEmail(emailLocal);
      onNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successMessage]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailLocal.trim()) {
      setError("Email address is required");
      return;
    }
    if (!validateEmail(emailLocal)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    dispatch(forgotPassword(emailLocal.trim()));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailLocal(e.target.value);
    if (error) setError("");
  };

  return (
    <AuthLayout>
      {/* Back to Login */}
      <button type="button" onClick={onBack} className={styles.backBtn}>
        <ArrowLeft size={16} />
        Back to Login
      </button>

      <div className={styles.headerBlock}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className={styles.iconWrapper}
        >
          <Lock size={26} />
        </motion.div>
        <h2 className={styles.title}>Forgot Password?</h2>
        <p className={styles.subtitle}>
          Don't worry! Enter your registered email address and we'll send you a
          verification code to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <div className={styles.fieldGroup}>
          <label htmlFor="email" className={styles.label}>
            Email Address
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>
              <Mail size={18} />
            </span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email address"
              value={emailLocal}
              onChange={handleChange}
              disabled={loading}
              className={[
                styles.input,
                error ? styles.inputError : "",
              ].join(" ")}
            />
          </div>
          {error && (
            <p role="alert" className={styles.errorMsg}>
              <AlertCircle size={13} /> {error}
            </p>
          )}
        </div>

        <AuthButton type="submit" loading={loading} icon={<Send size={16} />}>
          Send Verification Code
        </AuthButton>
      </form>

      <p className={styles.footer}>
        Remember your password?{" "}
        <button type="button" onClick={onBack} className={styles.footerLink}>
          Login
        </button>
      </p>
    </AuthLayout>
  );
}