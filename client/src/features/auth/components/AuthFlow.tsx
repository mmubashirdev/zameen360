import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ForgetPassword from "../pages/ForgetPassword";
import OTPVerification from "../pages/OTPVerification";
import CreateNewPassword from "../pages/CreateNewPassword";
import SuccessPage from "../pages/SuccessPage";

type Step = 1 | 2 | 3 | 4;

interface AuthFlowProps {
  initialStep?: Step;
}

function AuthFlow({ initialStep = 1 }: AuthFlowProps) {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(() => {
    const savedStep = sessionStorage.getItem("auth_flow_step");
    return savedStep ? (Number(savedStep) as Step) : initialStep;
  });

  const [email, setEmail] = useState<string>(() => {
    return sessionStorage.getItem("auth_flow_email") || "";
  });

  useEffect(() => {
    sessionStorage.setItem("auth_flow_step", String(step));
  }, [step]);

  useEffect(() => {
    sessionStorage.setItem("auth_flow_email", email);
  }, [email]);

  const goNext = () => setStep((s) => Math.min(4, s + 1) as Step);

  const goBack = () => {
    setStep((s) => {
      const nextStep = Math.max(1, s - 1) as Step;
      if (nextStep === 1) {
        sessionStorage.removeItem("auth_flow_step");
        sessionStorage.removeItem("auth_flow_email");
        sessionStorage.removeItem("otp_expiry_time");
      }
      return nextStep;
    });
  };

  const goToLogin = () => {
    setStep(1);
    setEmail("");
    sessionStorage.removeItem("auth_flow_step");
    sessionStorage.removeItem("auth_flow_email");
    sessionStorage.removeItem("otp_expiry_time");
    navigate("/login");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ForgetPassword
            key="step1"
            onNext={goNext}
            onBack={goToLogin}
            setEmail={setEmail}
          />
        );
      case 2:
        return (
          <OTPVerification
            key="step2"
            onNext={goNext}
            onBack={goBack}
            onBackToLogin={goToLogin}
            email={email}
          />
        );
      case 3:
        return (
          <CreateNewPassword
            key="step3"
            onNext={goNext}
            onBack={goBack}
            onBackToLogin={goToLogin}
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
        className="w-full h-full flex-1 flex flex-col"
      >
        {renderStep()}
      </motion.div>
    </AnimatePresence>
  );
}

export default AuthFlow;
