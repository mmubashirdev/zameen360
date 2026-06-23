// client/src/features/marketplace/pages/CreatePropertyPost.tsx
import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@features/auth/hooks/useAuth";
import { useProperty } from "../components/context/useProperty";
import ProgressSteps from "../components/PostProperty/ProgressSteps";
import BasicInformation from "../components/PostProperty/BasicInformation";
import PropertyDetails from "../components/PostProperty/PropertyDetails";
import PricingDetails from "../components/PostProperty/PricingDetails";
import MediaAndDetailStep from "./MediaAndDetail";
import ReviewSubmitStep from "./ReviewSubmit";
import LivePreview from "../components/PostProperty/LivePreview";
import DashboardNavbar from "../components/DashboardNavbar";
import styles from "../components/PostProperty/styles/PostProperty.module.css";

interface NavButtonsProps {
  step: number;
  onBack: () => void;
  onNext: () => void;
}

const NavButtons = ({ step, onBack, onNext }: NavButtonsProps) => {
  const nextLabels: Record<number, string> = {
    1: "Next: Media & Location",
    2: "Next: Review & Submit",
  };

  return (
    <div className={styles.actions}>
      {step > 1 && (
        <button type="button" className={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={16} />
          Back
        </button>
      )}
      <button type="button" className={styles.nextBtn} onClick={onNext}>
        {nextLabels[step]}
        <ArrowRight size={16} />
      </button>
    </div>
  );
};

const CreatePropertyPost = () => {
  const [step, setStep] = useState(1);
  const { validate, errors } = useProperty();
  const { user, isLoading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user && user.role !== 'SELLER' && user.role !== 'SOCIETY_OWNER') {
      toast.error("Only sellers and society owners can post properties. Please switch your account.");
      navigate("/profile");
    }
  }, [user, isLoading, navigate]);

  if (isLoading || (user && user.role !== 'SELLER' && user.role !== 'SOCIETY_OWNER')) {
    return null; // or a loading spinner
  }

  const handleNext = () => {
    const isValid = step === 2 || validate(step);

    if (!isValid) {
      const firstErrorKey = Object.keys(errors)[0];
      const firstErrorMsg = firstErrorKey
        ? errors[firstErrorKey as keyof typeof errors]
        : "Please fill all required fields";

      toast.error(firstErrorMsg || "Please fill all required fields");

      setTimeout(() => {
        const firstError = document.querySelector('[data-error="true"]');
        firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);

      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStep((s) => Math.max(s - 1, 1));
  };

  // ⭐ Direct step jump - for Edit buttons
  const goToStep = (targetStep: number) => {
    console.log("🔄 goToStep called with:", targetStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStep(targetStep);
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar />
      <main className={styles.main}>
        <div className={styles.heading}>
          <h1>Post Your Property</h1>
          <p className="pt-10">Fill in the details below to list your property</p>
        </div>

        <ProgressSteps currentStep={step} />

        {/* ============ STEP 1 ============ */}
        {step === 1 && (
          <div className={styles.layout}>
            <div className={styles.form}>
              <BasicInformation />
              <PropertyDetails />
              <PricingDetails />
              <NavButtons step={step} onBack={handleBack} onNext={handleNext} />
            </div>
            <LivePreview />
          </div>
        )}

        {/* ============ STEP 2 ============ */}
        {step === 2 && (
          <div className={styles.layoutFull}>
            <div className={styles.form}>
              <MediaAndDetailStep onNext={handleNext} onBack={handleBack} />
            </div>
          </div>
        )}

        {/* ============ STEP 3 ============ */}
        {step === 3 && (
          <div className={styles.layoutFull}>
            <div className={styles.form}>
              {/* ⭐ NO NavButtons here - ReviewSubmit has its own buttons */}
              <ReviewSubmitStep onBack={handleBack} onEditStep={goToStep} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreatePropertyPost;
