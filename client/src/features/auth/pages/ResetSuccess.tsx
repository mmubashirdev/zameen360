import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Check, Shield } from "lucide-react";

import AuthLayout from "../components/AuthLayout";
import StepIndicator from "../components/StepIndicator";
import AuthButton from "../components/AuthButton";
import { clearAuthSuccess } from "../auth.slice";
import type { AppDispatch } from "../../../app/stores/store";

export default function ResetSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = () => {
    dispatch(clearAuthSuccess());
    navigate("/login");
  };

  return (
    <AuthLayout>
      <StepIndicator currentStep={4} />

      <div className="text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 14,
            delay: 0.1,
          }}
          className="relative w-24 h-24 mx-auto mb-6"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0.6 }}
            animate={{ scale: 1.3, opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-green-300"
          />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-right from-green-100 to-green-200 border-4 border-green-300 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
            >
              <Check size={42} strokeWidth={3} className="text-green-600" />
            </motion.div>
          </div>
        </motion.div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Password Reset Successful!
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-7">
          Your password has been reset successfully.
          <br />
          You can now login with your new password.
        </p>

        <AuthButton onClick={handleLogin}>Login to Your Account</AuthButton>

        <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-left">
          <div className="w-9 h-9  rounded-lg bg-white border border-blue-100 flex items-center justify-center">
            <Shield size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Security Tip</p>
            <p className="text-xs text-gray-600 leading-relaxed mt-0.5">
              For better security, don't share your password with anyone.
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
