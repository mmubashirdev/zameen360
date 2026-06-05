// client/src/features/marketplace/pages/CreatePropertyPost.tsx
import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { PropertyProvider } from "../components/context/PropertyContext";
import { useProperty } from "../components/context/useProperty";
import ProgressSteps from "../components/PostProperty/ProgressSteps";
import BasicInformation from "../components/PostProperty/BasicInformation";
import PropertyDetails from "../components/PostProperty/PropertyDetails";
import PricingDetails from "../components/PostProperty/PricingDetails";
import LivePreview from "../components/PostProperty/LivePreview";
import PropertyNav from "../components/PostProperty/PropertyNav";
import styles from "../components/PostProperty/styles/PostProperty.module.css";

// ─── Inner form (inside Provider so it can use context) ───────────────────────
const PostPropertyForm = () => {
  const [step, setStep] = useState(1);
  const { validate } = useProperty();

  const handleNext = () => {
    // ✅ Pass current step — validates only relevant fields
    const isValid = validate(step);

    // ✅ Explicit guard — do NOT advance if invalid
    if (!isValid) {
      // Scroll to first error so user sees it
      const firstError = document.querySelector('[data-error="true"]');
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1));
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

        <div className={styles.layout}>
          <div className={styles.form}>
            {step === 1 && (
              <>
                <BasicInformation />
                <PropertyDetails />
              </>
            )}

            {step === 2 && <PricingDetails />}

            {step === 3 && <div>Review & Submit</div>}

            {/* ── Navigation ── */}
            <div className={styles.actions}>
              {step > 1 && (
                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={handleBack}
                >
                  <ArrowLeft size={16} /> Back
                </button>
              )}

              <button
                type="button"
                className={styles.nextBtn}
                onClick={handleNext}
              >
                {step === 3
                  ? "Submit Listing"
                  : "Next: " +
                    ["", "Media & Location", "Review & Submit"][step]}
                {step < 3 && <ArrowRight size={16} />}
              </button>
            </div>
          </div>
          <LivePreview />
        </div>
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
