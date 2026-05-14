import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { KeyRound, Lock } from "lucide-react";

import { resetPassword, clearAuthError, clearAuthSuccess } from "../auth.slice";
import AuthLayout from "../components/AuthLayout";
import StepIndicator from "../components/StepIndicator";
import AuthButton from "../components/AuthButton";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import type { AppDispatch, RootState } from "../../../app/stores/store";

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
          Reset Password
        </h2>
        <p className="text-sm text-gray-500">Enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock size={18} />
            </span>
            <input
              type="password"
              id="password"
              placeholder="Enter new password"
              {...register("password")}
              className={[
                "w-full pl-11 pr-4 py-3 text-sm rounded-xl border outline-none transition-all duration-200 bg-gray-50",
                errors.password
                  ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100",
              ].join(" ")}
            />
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-600" role="alert">
              {errors.password.message}
            </p>
          )}
          <PasswordStrengthMeter password={passwordValue} />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock size={18} />
            </span>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm new password"
              {...register("confirmPassword")}
              className={[
                "w-full pl-11 pr-4 py-3 text-sm rounded-xl border outline-none transition-all duration-200 bg-gray-50",
                errors.confirmPassword
                  ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100",
              ].join(" ")}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-red-600" role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <AuthButton type="submit" loading={loading} className="mt-2">
          Reset Password
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
