import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { KeyRound, Lock, Loader2 } from "lucide-react";

import { resetPassword, clearAuthError, clearAuthSuccess } from "../auth.slice";
import AuthLayout from "../components/AuthLayout";
import StepIndicator from "../components/StepIndicator";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import type { AppDispatch, RootState } from "../../../app/stores/store";
import styles from "../styles/createNewPassword.module.css";

const ChangePasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

export default function ChangePassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error, successMessage, emailForReset } = useSelector(
    (state: RootState) =>
      state.auth || {
        loading: false,
        error: null,
        successMessage: null,
        emailForReset: null,
      },
  );

  useEffect(() => {
    if (!emailForReset) {
      toast.error("Email for reset is missing.");
      navigate("/forget-password");
    }
  }, [emailForReset, navigate]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const passwordValue = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearAuthSuccess());
      navigate("/success");
    }
  }, [error, successMessage, dispatch, navigate]);

  const onSubmit = (data: ChangePasswordFormData) => {
    if (emailForReset) {
      dispatch(
        resetPassword({ email: emailForReset, password: data.password }),
      );
    }
  };

  return (
    <AuthLayout>
      <StepIndicator currentStep={3} />

      <div className={styles.headerBlock}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className={styles.iconWrapper}
        >
          <KeyRound size={26} />
        </motion.div>
        <h2 className={styles.title}>Reset Password</h2>
        <p className={styles.subtitle}>Enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* New Password */}
        <div className={styles.fieldGroup}>
          <label htmlFor="password" className={styles.label}>
            New Password
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>
              <Lock size={18} />
            </span>
            <input
              type="password"
              id="password"
              placeholder="Enter new password"
              {...register("password")}
              className={[
                styles.input,
                errors.password ? styles.inputMismatch : "",
              ].join(" ")}
            />
          </div>
          {errors.password && (
            <p className={styles.errorMsg} role="alert">
              {errors.password.message}
            </p>
          )}
          <PasswordStrengthMeter password={passwordValue} />
        </div>

        {/* Confirm Password */}
        <div className={styles.fieldGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm Password
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>
              <Lock size={18} />
            </span>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm new password"
              {...register("confirmPassword")}
              className={[
                styles.input,
                errors.confirmPassword ? styles.inputMismatch : "",
              ].join(" ")}
            />
          </div>
          {errors.confirmPassword && (
            <p className={styles.errorMsg} role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
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
