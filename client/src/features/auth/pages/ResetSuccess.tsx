import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Check, Shield } from "lucide-react";

import AuthLayout from "../components/AuthLayout";
import StepIndicator from "../components/StepIndicator";
import AuthButton from "../components/AuthButton";
import { clearAuthSuccess } from "../auth.slice";
import type { AppDispatch } from "../../../app/stores/store";
import styles from "../styles/resetSuccess.module.css";

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

      <div className={styles.container}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 14,
            delay: 0.1,
          }}
          className={styles.iconOuter}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0.6 }}
            animate={{ scale: 1.3, opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            className={styles.ripple}
          />
          <div className={styles.iconCircle}>
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
            >
              <Check size={42} strokeWidth={3} />
            </motion.div>
          </div>
        </motion.div>

        <h2 className={styles.title}>Password Reset Successful!</h2>
        <p className={styles.subtitle}>
          Your password has been reset successfully.
          <br />
          You can now login with your new password.
        </p>

        <AuthButton onClick={handleLogin}>Login to Your Account</AuthButton>

        <div className={styles.securityTip}>
          <div className={styles.tipIconBox}>
            <Shield size={18} />
          </div>
          <div>
            <p className={styles.tipTitle}>Security Tip</p>
            <p className={styles.tipText}>
              For better security, don't share your password with anyone.
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
