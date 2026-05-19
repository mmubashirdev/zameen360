import styles from "../styles/auth.module.css";
import AuthNavbar         from "../components/AuthNavbar";
import SignupForm         from "../components/SignupForm";
import { useToast }       from "@shared/hooks/useToast";
import { HERO_FEATURES }  from "../constants/authConstants";
import image from "../assets/photo-1594540992254-0e2239661647.avif"


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
              src={image}
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

  

      
    </div>
  );
}