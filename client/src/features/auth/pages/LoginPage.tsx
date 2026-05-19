import styles from "../styles/login.module.css";
import LoginForm from "../components/LoginForm";
import { ToastContainer } from "@shared/components/Toast";
import { useToast } from "@shared/hooks/useToast";
import { HERO_FEATURES } from "../constants/authConstants";
import loginBg from "@features/auth/assets/Gemini_Generated_Image_1092l1092l1092l1.png"; 
import image1 from "../assets/photo-1721815693498-cc28507c0ba2.avif"
import image2 from "../assets/photo-1722421492323-eaf9c401befe.avif"

export default function LoginPage() {
  const toast = useToast();

  return (
    <main className={styles.loginPage}>
     
      <div className={styles.bgImage}>
        <img src={loginBg} alt="Modern luxury villa at dusk with pool" />
      </div>

     
      <div className={styles.bgOverlay} aria-hidden="true" />

    
      <div className={styles.content}>
      
        <section className={styles.heroSide} aria-label="Property showcase">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Find. Buy. Sell.
              <br />
              Your Property{" "}
              <span className={styles.heroTitleAccent}>360°</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Discover the best properties, connect with trusted buyers &
              sellers, and make smart real estate decisions.
            </p>
          </div>

          <div className={styles.heroFeatures}>
            {HERO_FEATURES.map((f, i) => (
              <div key={i} className={styles.heroFeature}>
                <div className={styles.heroFeatureIcon}>
                  <i className={`fa-solid ${f.icon}`} aria-hidden="true" />
                </div>
                <div className={styles.heroFeatureText}>{f.title}</div>
              </div>
            ))}
          </div>
        </section>

       
        <section className={styles.formSection} aria-label="Login form">
          <LoginForm toast={toast} />
        </section>
      </div>

      <ToastContainer
        toasts={toast.toasts}
        removeToast={toast.removeToast}
      />
    </main>
  );
}