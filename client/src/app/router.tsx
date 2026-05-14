<<<<<<< HEAD
import { BrowserRouter } from "react-router-dom";
import { AuthProvider }  from "@features/auth/context/AuthContext";
import AuthRoutes        from "@features/auth/routes/AuthRoutes";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
=======
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Route, Routes, Navigate } from "react-router-dom";
import ForgetPassword from "../features/auth/pages/ForgetPassword";
import OTPVerification from "../features/auth/pages/OTPVerification";
import CreateNewPassword from "../features/auth/pages/CreateNewPassword";
import SuccessPage from "../features/auth/pages/SuccessPage";
import Signup from "../features/auth/pages/Signup";

type Step = 1 | 2 | 3 | 4;

function AuthFlow() {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState<string>("");

  const goNext = () => setStep((s) => Math.min(4, s + 1) as Step);
  const goBack = () => setStep((s) => Math.max(1, s - 1) as Step);
  const goToLogin = () => {
    setStep(1);
    setEmail("");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ForgetPassword key="step1" onNext={goNext} setEmail={setEmail} />
        );
      case 2:
        return (
          <OTPVerification
            key="step2"
            onNext={goNext}
            onBack={goBack}
            email={email}
          />
        );
      case 3:
        return (
          <CreateNewPassword
            key="step3"
            onNext={goNext}
            onBack={goBack}
            email={email}
          />
        );
      case 4:
        return <SuccessPage key="step4" onLogin={goToLogin} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {renderStep()}
      </motion.div>
    </AnimatePresence>
  );
}

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<AuthFlow />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default AppRouter;
>>>>>>> 73e3d77bffa835c174f5a328cebf8a0dded8809f
