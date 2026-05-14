import { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import styles from "../styles/auth.module.css";
import {
  signupSchema,
  type SignupSchemaType,
} from "../validations/signupSchema";
import { useAuth } from "../hooks/useAuth";
import { PAKISTAN_CITIES } from "../constants/authConstants";
import type { ToastHook } from "../types/auth.types";

import PasswordStrength from "./PasswordStrength";
import ImageUploadPreview from "./ImageUploadPreview";
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

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
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
      role: undefined,
      profileImage: null,
      terms: undefined,
    },
    mode: "onBlur",
  });

  const watchedPassword = watch("password");
  const watchedRole = watch("role");

  // ── Submit ──────────────────────────────────────────────────────────────────

  const onSubmit = useCallback(
    async (data: SignupSchemaType) => {
      try {
        const result = await signup(data);
        setSubmitSuccess(true);
        toast.success(
          "Welcome to Zameen 360!",
          result.message ?? "Account created! Please verify your email."
        );
        setTimeout(() => {
          navigate("/verify-email", {
            state: {
              userId: result.user?.userId,
              email: result.user?.email,
            },
          });
        }, 1800);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
        toast.error("Registration Failed", message);
      }
    },
    [signup, navigate, toast]
  );

  const onValidationError = useCallback(() => {
    toast.error(
      "Validation Error",
      "Please fix the errors highlighted below."
    );
  }, [toast]);

  // ── Google OAuth ────────────────────────────────────────────────────────────

  const handleGoogleClick = useCallback(async () => {
    setIsGoogleLoading(true);
    try {
      toast.info(
        "Google OAuth",
        "Redirecting to Google for authentication..."
      );
      await new Promise<void>((r) => setTimeout(r, 1500));
    } catch {
      toast.error("OAuth Error", "Failed to connect to Google.");
    } finally {
      setIsGoogleLoading(false);
    }
  }, [toast]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className={styles.formContainer}>
      {/* Header */}
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
        {/* ── Full Name ───────────────────────────────────────────────────── */}
        <div className={styles.formGroup}>
          <div className={styles.inputWrapper}>
            <i
              className={`fa-solid fa-user ${styles.inputIcon}`}
              aria-hidden="true"
            />
            <input
              {...register("fullName")}
              id="fullName"
              type="text"
              placeholder="Full Name"
              className={`${styles.formInput} ${errors.fullName ? styles.inputError : ""
                }`}
              aria-required="true"
            />
          </div>
          {errors.fullName && (
            <p className={styles.fieldError} role="alert">
              <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* ── Email & Phone ───────────────────────────────────────────────── */}
        <div className={styles.formGroupRow}>
          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <i
                className={`fa-solid fa-envelope ${styles.inputIcon}`}
                aria-hidden="true"
              />
              <input
                {...register("email")}
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
            <div className={styles.inputWrapper}>
              <i
                className={`fa-solid fa-phone ${styles.inputIcon}`}
                aria-hidden="true"
              />
              <input
                {...register("phone")}
                id="phone"
                type="tel"
                placeholder="Phone Number"
                className={`${styles.formInput} ${errors.phone ? styles.inputError : ""
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

        {/* ── City ───────────────────────────────────────────────────────── */}
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

        {/* ── Password & Confirm ──────────────────────────────────────────── */}
        <div className={styles.formGroupRow}>
          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <i
                className={`fa-solid fa-lock ${styles.inputIcon}`}
                aria-hidden="true"
              />
              <input
                {...register("password")}
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

        {/* ── Role Cards ──────────────────────────────────────────────────── */}
        <div className={styles.roleSection}>
          <label className={styles.roleSectionLabel}>
            I am a <span className={styles.required}>*</span>
          </label>
          <div
            className={styles.roleCards}
            role="radiogroup"
            aria-label="Select your role"
          >
            {(
              [
                { value: "buyer", icon: "fa-user", label: "Buyer" },
                { value: "seller", icon: "fa-house", label: "Seller" },
              ] as const
            ).map(({ value, icon, label }) => (
              <label
                key={value}
                className={[
                  styles.roleCard,
                  watchedRole === value ? styles.roleCardSelected : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setValue("role", value, { shouldValidate: true });
                  }
                }}
              >
                <input
                  {...register("role")}
                  type="radio"
                  value={value}
                  className={styles.hiddenRadio}
                  aria-label={label}
                />
                <div className={styles.roleIconWrap}>
                  <i
                    className={`fa-solid ${icon} ${styles.roleIcon}`}
                    aria-hidden="true"
                  />
                </div>
                <span className={styles.roleText}>{label}</span>
              </label>
            ))}
          </div>
          {errors.role && (
            <p className={styles.fieldError} role="alert">
              <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
              {errors.role.message}
            </p>
          )}
        </div>

        {/* ── Profile Image ───────────────────────────────────────────────── */}
        <Controller
          name="profileImage"
          control={control}
          render={({ field: { onChange }, fieldState: { error } }) => (
            <ImageUploadPreview
              onChange={onChange}
              error={error?.message}
            />
          )}
        />

        {/* ── Terms Checkbox ──────────────────────────────────────────────── */}
        <Controller
          name="terms"
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <div
              className={[
                styles.checkboxGroup,
                error ? styles.checkboxGroupError : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className={styles.checkboxBox}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={value === true}
                  onChange={(e) =>
                    onChange(e.target.checked ? true : undefined)
                  }
                />
                <div
                  className={[
                    styles.checkboxVisual,
                    value === true ? styles.checkboxChecked : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </div>
              </div>
              <label className={styles.checkboxLabel} htmlFor="terms">
                I agree to the{" "}
                <Link to="/terms">Terms of Service</Link> and{" "}
                <Link to="/privacy">Privacy Policy</Link>
              </label>
            </div>
          )}
        />
        {errors.terms && (
          <p
            className={styles.fieldError}
            role="alert"
            style={{ marginTop: -8, marginBottom: 8 }}
          >
            <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
            {errors.terms.message}
          </p>
        )}

        {/* ── Submit Button ───────────────────────────────────────────────── */}
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

        {/* ── Social Login ────────────────────────────────────────────────── */}
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