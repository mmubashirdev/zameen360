import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/auth.module.css";
import {
  signupSchema,
  type SignupSchemaType,
} from "../validations/signupSchema";
import { useAuth, detectErrorField } from "../hooks/useAuth";
import {
  PAKISTAN_CITIES,
  VERIFY_EMAIL_CODE_KEY,
  VERIFY_EMAIL_PENDING_EMAIL_KEY,
  VERIFY_EMAIL_RESEND_KEY,
} from "../constants/authConstants";
import { getErrorMessage } from "@shared/utils/errorHandler";
import type { ToastHook } from "../types/auth.types";
import { becomeSeller } from "../api/authApi";
import { API_BASE_URL } from "@shared/config/api";

import PasswordStrength from "./PasswordStrength";
import SocialLogin from "./SocialLogin";

interface SignupFormProps {
  toast: ToastHook;
}

export default function SignupForm({ toast }: SignupFormProps) {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // "Switch to Seller" state — only available after a successful signup in-session
  const [isSellerSwitching, setIsSellerSwitching] = useState(false);
  const [signedUpUserId, setSignedUpUserId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      city: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const watchedPassword = watch("password");

  // ── Submit ────────────────────────────────────────────────────────────────

  const onSubmit = useCallback(
    async (data: SignupSchemaType) => {
      try {
        const result = await signup(data);
        setSubmitSuccess(true);
        setSignedUpUserId(result.data.userId);
        if (result.data?.resendAvailableAt) {
          sessionStorage.setItem(VERIFY_EMAIL_RESEND_KEY, result.data.resendAvailableAt);
        }
        if (result.data?.otpExpiresAt) {
          sessionStorage.setItem(VERIFY_EMAIL_CODE_KEY, result.data.otpExpiresAt);
        }
        sessionStorage.setItem(VERIFY_EMAIL_PENDING_EMAIL_KEY, result.data.email);
        toast.success(
          "Account Created!",
          "Please verify your email to continue."
        );
        navigate("/verify-email", {
          state: {
            userId: result.data?.userId,
            email: result.data?.email,
            otpExpiresAt: result.data?.otpExpiresAt,
            resendAvailableAt: result.data?.resendAvailableAt,
          },
        });
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Something went wrong. Please try again."
        );

        const field = detectErrorField(message);

        if (field === "email") {
          setError("email", { type: "manual", message });
          document.getElementById("email")?.focus();
        } else if (field === "password") {
          setError("password", { type: "manual", message });
        } else if (field === "phone") {
          setError("phone", { type: "manual", message });
        } else {
          setError("email", { type: "manual", message });
        }
      }
    },
    [signup, navigate, toast, setError]
  );

  const onValidationError = useCallback(() => { }, []);

  const handleInputChange = useCallback(
    (fieldName: keyof SignupSchemaType) => {
      if (errors[fieldName]?.type === "manual") {
        clearErrors(fieldName);
      }
    },
    [errors, clearErrors]
  );

  const handleGoogleClick = useCallback(() => {
    setIsGoogleLoading(true);
    window.location.href = `${API_BASE_URL}/auth/google`;
  }, []);

  // ── Switch to Seller ──────────────────────────────────────────────────────
  const handleBecomeSeller = useCallback(async () => {
    setIsSellerSwitching(true);
    try {
      await becomeSeller();
      toast.success("You're now a Seller!", "Your account has been upgraded.");
    } catch (err) {
      toast.error(
        "Could not switch role",
        getErrorMessage(err, "Please try again later.")
      );
    } finally {
      setIsSellerSwitching(false);
    }
  }, [toast]);

  return (
    <div className={styles.formContainer}>

      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Create Account</h2>
        <p className={styles.formSubtitle}>
          Join Zameen 360 and start exploring properties
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, onValidationError)}
        noValidate
        autoComplete="off"
      >

        <div className={styles.formGroupRow}>

          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <i
    className={`fa-solid fa-user ${styles.inputIcon}`}
    aria-hidden="true"
  />
  <input
    {...register("fullName", {
      onChange: () => handleInputChange("fullName"),
    })}
    id="fullName"
    type="text"
    placeholder="Full Name"
    className={`${styles.formInput} ${errors.fullName ? styles.inputError : ""}`}
    aria-required="true"
    onKeyDown={(e) => {
      const blockedKeys = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/;
      if (blockedKeys.test(e.key)) {
        e.preventDefault();
      }
    }}
    onPaste={(e) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData("text");
      const cleaned = pastedText.replace(/[^A-Za-z\s]/g, "");
      document.execCommand("insertText", false, cleaned);
    }}
  />
</div>
{errors.fullName && (
  <p className={styles.fieldError} role="alert">
    <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
    {errors.fullName.message}
  </p>
            )}
          </div>

          {/* City */}
          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <i
                className={`fa-solid fa-location-dot ${styles.inputIcon}`}
                aria-hidden="true"
              />
              <select
                {...register("city")}
                id="city"
                className={`${styles.formSelect} ${errors.city ? styles.selectError : ""
                  }`}
                aria-required="true"
              >
                <option value="">Select your city</option>
                {PAKISTAN_CITIES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            {errors.city && (
              <p className={styles.fieldError} role="alert">
                <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
                {errors.city.message}
              </p>
            )}
          </div>
        </div>

        {/* ── Row 2: Email + Phone ────────────────────────────────────── */}
        <div className={styles.formGroupRow}>
          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <i
                className={`fa-solid fa-envelope ${styles.inputIcon}`}
                aria-hidden="true"
              />
              <input
                {...register("email", {
                  onChange: () => handleInputChange("email"),
                })}
                id="email"
                type="email"
                placeholder="Email Address"
                className={`${styles.formInput} ${errors.email ? styles.inputError : ""
                  }`}
                aria-required="true"
              />
            </div>
            {errors.email && (
              <p className={styles.fieldError} role="alert">
                <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div className={styles.formGroup}>
            <div className={`${styles.inputWrapper} ${styles.phoneInputWrapper}`}>
              <div className={styles.countryPrefix}>
                <span className={styles.flag}>🇵🇰</span>
                <span className={styles.code}>+92</span>
              </div>
              <input
                {...register("phone", {
                  onChange: (e) => {
                    handleInputChange("phone");
                    let val = e.target.value;
                    val = val.replace(/\D/g, ""); // Keep only digits
                    if (val.startsWith("92") && val.length > 10) {
                      val = val.substring(2);
                    }
                    if (val.startsWith("0")) {
                      val = val.substring(1);
                    }
                    if (val.length > 10) {
                      val = val.substring(0, 10);
                    }
                    setValue("phone", val, { shouldValidate: true });
                  },
                })}
                id="phone"
                type="tel"
                placeholder="300 1234567"
                className={`${styles.formInput} ${styles.phoneInput} ${errors.phone ? styles.inputError : ""
                  }`}
                aria-required="true"
              />
            </div>
            {errors.phone && (
              <p className={styles.fieldError} role="alert">
                <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* ── Row 3: Password + Confirm ───────────────────────────────── */}
        <div className={styles.formGroupRow}>
          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <i
                className={`fa-solid fa-lock ${styles.inputIcon}`}
                aria-hidden="true"
              />
              <input
                {...register("password", {
                  onChange: () => handleInputChange("password"),
                })}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`${styles.formInput} ${styles.passwordInput} ${errors.password ? styles.inputError : ""
                  }`}
                aria-required="true"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i
                  className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  aria-hidden="true"
                />
              </button>
            </div>
            <PasswordStrength password={watchedPassword} />
            {errors.password && (
              <p className={styles.fieldError} role="alert">
                <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
                {errors.password.message}
              </p>
            )}
          </div>

          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <i
                className={`fa-solid fa-lock ${styles.inputIcon}`}
                aria-hidden="true"
              />
              <input
                {...register("confirmPassword")}
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                className={`${styles.formInput} ${styles.passwordInput} ${errors.confirmPassword ? styles.inputError : ""
                  }`}
                aria-required="true"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirm((p) => !p)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                <i
                  className={`fa-solid ${showConfirm ? "fa-eye-slash" : "fa-eye"
                    }`}
                  aria-hidden="true"
                />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className={styles.fieldError} role="alert">
                <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* ── Submit ──────────────────────────────────────────────────── */}
        <button
          type="submit"
          className={[
            styles.submitBtn,
            isSubmitting ? styles.submitBtnLoading : "",
          ]
            .filter(Boolean)
            .join(" ")}
          disabled={isSubmitting}
          aria-label="Create your account"
        >
          {submitSuccess ? (
            <>
              <i className="fa-solid fa-check" aria-hidden="true" />
              <span>Registered!</span>
            </>
          ) : isSubmitting ? (
            <>
              <div className={styles.spinner} aria-hidden="true" />
              <span>Registering...</span>
            </>
          ) : (
            <span>Register</span>
          )}
        </button>

        {/* ── Social Login ─────────────────────────────────────────────── */}
        <SocialLogin
          onGoogleClick={handleGoogleClick}
          isLoading={isGoogleLoading}
        />

        <p className={styles.formFooter}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
