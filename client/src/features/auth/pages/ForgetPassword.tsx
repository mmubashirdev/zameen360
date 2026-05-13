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

interface ForgotPasswordProps {
  onNext: () => void;
  setEmail: (email: string) => void;
}

export default function ForgotPassword({
  onNext,
  setEmail,
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
      <button
        type="button"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Login
      </button>

      <div className="text-center mb-7">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="w-16 h-16 mx-auto mb-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center"
        >
          <Lock size={26} className="text-blue-600" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Forgot Password?
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
          Don't worry! Enter your registered email address and we'll send you a
          verification code to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
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
                "w-full pl-11 pr-4 py-3 text-sm rounded-xl border outline-none transition-all duration-200 bg-gray-50",
                error
                  ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100",
              ].join(" ")}
            />
          </div>
          {error && (
            <p
              role="alert"
              className="mt-2 flex items-center gap-1.5 text-xs text-red-600"
            >
              <AlertCircle size={13} /> {error}
            </p>
          )}
        </div>

        <AuthButton type="submit" loading={loading} icon={<Send size={16} />}>
          Send Verification Code
        </AuthButton>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Remember your password?{" "}
        <button
          type="button"
          className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors"
        >
          Login
        </button>
      </p>
    </AuthLayout>
  );
}
