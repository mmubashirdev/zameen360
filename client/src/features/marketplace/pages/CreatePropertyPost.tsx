// client/src/features/marketplace/pages/CreatePropertyPost.tsx
import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { PropertyProvider } from "../components/context/PropertyContext";
import { useProperty } from "../components/context/useProperty";
import ProgressSteps from "../components/PostProperty/ProgressSteps";
import BasicInformation from "../components/PostProperty/BasicInformation";
import PropertyDetails from "../components/PostProperty/PropertyDetails";
import PricingDetails from "../components/PostProperty/PricingDetails";
import MediaAndDetailStep from "./MediaAndDetail";
import ReviewSubmitStep from "./ReviewSubmit";
import LivePreview from "../components/PostProperty/LivePreview";
import PropertyNav from "../components/PostProperty/PropertyNav";
import styles from "../components/PostProperty/styles/PostProperty.module.css";

// ✅ Extracted OUTSIDE — not inside any component function
interface NavButtonsProps {
  step: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const NavButtons = ({ step, onBack, onNext, onSubmit }: NavButtonsProps) => {
  const nextLabels: Record<number, string> = {
    1: "Next: Media & Location",
    2: "Next: Review & Submit",
    3: "Submit Listing",
  };

  return (
    <div className={styles.actions}>
      {step > 1 && (
        <button type="button" className={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={16} />
          Back
        </button>
      )}
      <button
        type="button"
        className={styles.nextBtn}
        onClick={step === 3 ? onSubmit : onNext}
      >
        {nextLabels[step]}
        {step < 3 && <ArrowRight size={16} />}
      </button>
    </div>
  );
};

// ─── Inner form ───────────────────────────────────────────────────────────────
const PostPropertyForm = () => {
  const [step, setStep] = useState(1);
  const { validate } = useProperty();

  const handleNext = () => {
    const isValid = validate(step);
    if (!isValid) {
      const firstError = document.querySelector('[data-error="true"]');
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = () => {
    console.log("Submitting listing...");
  };

  return (
    <div className={styles.page}>
      <PropertyNav />
      <main className={styles.main}>
        <div className={styles.heading}>
          <h1>Post Your Property</h1>
          <p>Fill in the details below to list your property</p>
        </div>

        <ProgressSteps currentStep={step} />

        {/* ✅ Step 1: Two-column layout with LivePreview */}
        {step === 1 && (
          <div className={styles.layout}>
            <div className={styles.form}>
              <BasicInformation />
              <PropertyDetails />
              <PricingDetails />
              <NavButtons
                step={step}
                onBack={handleBack}
                onNext={handleNext}
                onSubmit={handleSubmit}
              />
            </div>
            <LivePreview />
          </div>
        )}

        {/* ✅ Step 2: Full width */}
        {step === 2 && (
          <div className={styles.layoutFull}>
            <div className={styles.form}>
              <MediaAndDetailStep />
            </div>
          </div>
        )}

        {/* ✅ Step 3: Full width */}
        {step === 3 && (
          <div className={styles.layoutFull}>
            <div className={styles.form}>
              <ReviewSubmitStep />
              <NavButtons
                step={step}
                onBack={handleBack}
                onNext={handleNext}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// ─── Wrap with Provider ───────────────────────────────────────────────────────
const CreatePropertyPost = () => (
  <PropertyProvider>
    <PostPropertyForm />
  </PropertyProvider>
);

export default CreatePropertyPost;
