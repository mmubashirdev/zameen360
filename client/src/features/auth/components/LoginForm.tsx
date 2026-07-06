import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/login.module.css";
import { useAuth, detectErrorField } from "../hooks/useAuth";
import { getErrorMessage } from "@shared/utils/errorHandler";
import { API_BASE_URL } from "@shared/config/api";
import {
  loginSchema,
  type LoginSchemaType,
} from "../validations/loginValidationSchema";
import type { ToastHook } from "../types/auth.types";
interface LoginFormProps {
  toast: ToastHook;
}

export default function LoginForm({ toast }: LoginFormProps) {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",

    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const result = await login({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      console.log("login result:", result);

      toast.success("Welcome Back!", result.message ?? "Login successful.");


      const destination =
        result.user.role === "SOCIETY_OWNER" || result.user.role === "SELLER"
          ? "/profile"
          : "/marketplace";

      navigate(destination, { replace: true });
    } catch (err) {
      const message = getErrorMessage(err, "Login failed. Please try again.");

      const field = detectErrorField(message);

      if (field === "email") {
        setError("email", {
          type: "manual",
          message: message,
        });
      } else if (field === "password") {
        setError("password", {
          type: "manual",
          message: message,
        });
      } else {

        setError("password", {
          type: "manual",
          message: message,
        });
      }
    }
  };


  const handleInputChange = (fieldName: keyof LoginSchemaType) => {
    if (errors[fieldName]?.type === "manual") {
      clearErrors(fieldName);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <div className={styles.formCard}>
      <div className={styles.brand}>
        <div className={styles.brandLogo}>
          <img
            className={styles.brandLogoImg}
            src="https://z-cdn-media.chatglm.cn/files/8ecfdb5c-41b7-46cd-9808-b5cb303771d5.png?auth_key=1878622656-9379a6c556d7402a8d00fad834383a96-0-a4b6e6ca5ebfbff119124e83c08a6bb4"
            alt="Zameen 360 Logo"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <p className={styles.brandTagline}>
          Find. Buy. Sell. Your Property 360°
        </p>
      </div>

      <h2 className={styles.welcomeTitle}>Welcome Back!</h2>
      <p className={styles.welcomeSubtitle}>
        Login to continue to your account
      </p>

      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div>
          <div className={styles.inputGroup}>
            <i
              className={`fa-solid fa-user ${styles.inputIcon}`}
              aria-hidden="true"
            />
            <input
              type="email"
              autoComplete="username"
              placeholder="Email Address"
              className={`${styles.input} ${errors.email ? styles.inputError : ""
                }`}
              {...register("email", {
                onChange: () => handleInputChange("email"),
              })}
            />
          </div>
          {errors.email && (
            <p className={styles.errorText}>{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className={styles.inputGroup}>
            <i
              className={`fa-solid fa-lock ${styles.inputIcon}`}
              aria-hidden="true"
            />
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Password"
              className={`${styles.input} ${errors.password ? styles.inputError : ""
                }`}
              {...register("password", {
                onChange: () => handleInputChange("password"),
              })}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <i
                className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                aria-hidden="true"
              />
            </button>
          </div>
          {errors.password && (
            <p className={styles.errorText}>{errors.password.message}</p>
          )}
        </div>

        <div className={styles.optionsRow}>
          <label className={styles.checkboxWrapper}>
            <input
              type="checkbox"
              className={styles.checkbox}
              {...register("rememberMe")}
            />
            <span className={styles.checkboxLabel}>Remember Me</span>
          </label>

          <Link to="/forgot-password" className={styles.forgotLink}>
            Forgot Password?
          </Link>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className={styles.divider}>OR</div>

      <button
        type="button"
        className={styles.googleBtn}
        onClick={handleGoogleLogin}
      >
        <svg
          className={styles.googleIcon}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >

          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      <p className={styles.formFooter}>
        Don't have an account?
        <Link to="/signup" className={styles.registerLink}>
          Register
        </Link>
      </p>
    </div>
  );
}
