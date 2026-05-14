import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/login.module.css";
import { useAuth } from "../hooks/useAuth";
import {
  loginSchema,
  type LoginSchemaType,
} from "../validations/loginValidationSchema";
import type { useToast } from "@shared/hooks/useToast";

interface LoginFormProps {
  toast: ReturnType<typeof useToast>;
}

export default function LoginForm({ toast }: LoginFormProps) {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const result = await login({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      toast.success(result.message ?? "Login successful! Welcome back.");

      
      setTimeout(() => {
        if (result.user.role === "SELLER") {
          navigate("/seller/dashboard");
        } else {
          navigate("/");
        }
      }, 800);
    } catch (err) {
      const error = err as {
        message?: string;
        requiresVerification?: boolean;
      };

     
      if (error.requiresVerification) {
        toast.info(
          "Email verification required",
          "Please verify your email first."
        );
        setTimeout(
          () =>
            navigate("/verify-email", {
              state: {
                email: data.email.trim().toLowerCase(),
              },
            }),
          1000
        );
        return;
      }

      toast.error(error.message ?? "Login failed. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";
    window.location.href = `${baseUrl}/auth/google`;
  };

  return (
    <div className={styles.formCard}>
    
      <div className={styles.brand}>
        <div className={styles.brandLogo}>
          <img
            src="https://z-cdn-media.chatglm.cn/files/a6875cfd-97b4-4c6f-88f1-550d6a8fd092.png?auth_key=1878622656-5f4a780eeb0a4af0b8d855181ebfd693-0-f41294470d4d33f18e0c299f8ffe047e"
            alt="Zameen 360 Logo"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <div className={styles.brandName}>
          Zameen <span className={styles.brandNameAccent}>360</span>
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
              type="text"
              autoComplete="username"
              placeholder="Email or Phone Number"
              className={`${styles.input} ${
                errors.email ? styles.inputError : ""
              }`}
              {...register("email")}
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
              className={`${styles.input} ${
                errors.password ? styles.inputError : ""
              }`}
              {...register("password")}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <i
                className={`fa-solid ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                }`}
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

        
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isLoading}
        >
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
