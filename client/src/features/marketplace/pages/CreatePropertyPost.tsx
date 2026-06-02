import { ArrowRight } from "lucide-react";
import DashboardNavbar from "../components/DashboardNavbar";
import ProgressSteps from "../components/PostProperty/ProgressSteps";
import BasicInformation from "../components/PostProperty/BasicInformation";
import PropertyDetails from "../components/PostProperty/PropertyDetails";
import PricingDetails from "../components/PostProperty/PricingDetails";
import LivePreview from "../components/PostProperty/LivePreview";
import styles from "../components/PostProperty/styles/PostProperty.module.css";
import { useNavigate } from "react-router-dom";


const PostProperty = () => {
  const navigate = useNavigate();

  const NavigatetoMedia = () => {
    navigate("/media-and-details");
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar />

      <main className={styles.main}>
        <div className={styles.heading}>
          <h1>Post Your Property</h1>

          <p>
            List your property in 3 easy steps and reach thousands of buyers
          </p>

          <span className={styles.required}>
            Fields marked with <span className={styles.req}>*</span> are required
          </span>
        </div>

        <ProgressSteps />

        <div className={styles.layout}>
          <div className={styles.form}>
            <BasicInformation />
            <PropertyDetails />
            <PricingDetails />

            <div className={styles.actions}>
              <button
                onClick={NavigatetoMedia}
                className={styles.nextBtn}
              >
                Next: Media & Location <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <LivePreview />
        </div>
      </main>
    </div>
  );
};

export default PostProperty;