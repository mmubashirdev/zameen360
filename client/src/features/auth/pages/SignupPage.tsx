import styles from "../styles/auth.module.css";
import AuthNavbar         from "../components/AuthNavbar";
import AuthFooter         from "../components/AuthFooter";
import SignupForm         from "../components/SignupForm";
import { ToastContainer } from "@shared/components/Toast";
import { useToast }       from "@shared/hooks/useToast";
import { HERO_FEATURES }  from "../constants/authConstants";

export default function SignupPage() {
  const toast = useToast();

  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      <AuthNavbar />

      <main className={styles.signupPage}>
        {/* ── Hero / Left Column ────────────────────────────────────────── */}
        <section className={styles.hero} aria-label="Property showcase">
          <div className={styles.heroBg}>
            <img
              src="https://z-cdn-media.chatglm.cn/files/a6875cfd-97b4-4c6f-88f1-550d6a8fd092.png?auth_key=1878622656-5f4a780eeb0a4af0b8d855181ebfd693-0-f41294470d4d33f18e0c299f8ffe047e"
              alt="Luxury modern villa with pool at dusk"
            />
          </div>
          <div className={styles.heroOverlay} aria-hidden="true" />
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Find. Buy. Sell.
              <br />
              Your Property{" "}
              <span className={styles.heroTitleAccent}>360°</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Discover thousands of verified properties across Pakistan.
              Whether you're buying your dream home or selling an investment,
              we've got you covered.
            </p>
            <div className={styles.heroFeatures}>
              {HERO_FEATURES.map((f, i) => (
                <div key={i} className={styles.heroFeature}>
                  <div className={styles.heroFeatureIcon}>
                    <i className={`fa-solid ${f.icon}`} aria-hidden="true" />
                  </div>
                  <div className={styles.heroFeatureText}>
                    {f.title}
                    <small>{f.desc}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Form / Right Column ───────────────────────────────────────── */}
        <section className={styles.formSection} aria-label="Sign up form">
          <SignupForm toast={toast} />
        </section>
      </main>

      <AuthFooter />

      <ToastContainer
        toasts={toast.toasts}
        removeToast={toast.removeToast}
      />
    </div>
  );
}