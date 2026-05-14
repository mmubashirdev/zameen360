import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Shield } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import AuthButton from "../components/AuthButton";
import StepIndicator from "../components/StepIndicator";

interface SuccessPageProps {
  onLogin: () => void;
}

export default function SuccessPage({ onLogin }: SuccessPageProps) {
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    if (countdown <= 0) {
      onLogin();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, onLogin]);

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
          {/* Outer pulse ring */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0.6 }}
            animate={{ scale: 1.3, opacity: 0 }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute inset-0 rounded-full bg-green-300"
          />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-green-200 border-4 border-green-300 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
            >
              <Check size={42} strokeWidth={3} className="text-green-600" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
        >
          Password Reset Successful!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-gray-500 leading-relaxed mb-7"
        >
          Your password has been reset successfully.
          <br />
          You can now login with your new password.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <AuthButton onClick={onLogin}>Login to Your Account</AuthButton>
          <p className="text-xs text-gray-400 mt-3">
            Redirecting to login in{" "}
            <span className="font-semibold text-blue-600">{countdown}</span>{" "}
            second{countdown !== 1 ? "s" : ""}...
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-left"
        >
          <div className="w-9 h-9 flex-shrink-0 rounded-lg bg-white border border-blue-100 flex items-center justify-center">
            <Shield size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Security Tip</p>
            <p className="text-xs text-gray-600 leading-relaxed mt-0.5">
              For better security, don't share your password with anyone and use
              a strong password.
            </p>
          </div>
        </motion.div>
      </div>
    </AuthLayout>
  );
}
