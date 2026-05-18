import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Home, Users, MapPin } from "lucide-react";
import logo from "../../../assets/chatgpt_image_may_12__2026__11_24_22_pm_720-removebg-preview.png";
import styles from "../styles/authLayout.module.css";
import img3 from "../assets/image3.png"


interface AuthLayoutProps {
  children: ReactNode;
}

interface StatProps {
  icon: ReactNode;
  value: string;
  label: string;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.root}>
      {/* ─── Left Panel (Desktop only) ─────────────────────── */}
      <div className={styles.leftPanel}>
        <img
          src={img3}
          alt="Luxury Real Estate"
          className={styles.heroBg}
        />
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          {/* Brand with Logo */}
          <div>
            <img
              src={logo}
              alt="Zameen 360"
              className={styles.heroLogoImg}
            />
          </div>

          <div className={styles.heroBody}>
            <h2 className={styles.heroHeading}>
              Find. Buy. Sell.
              <br />
              Your Property{" "}
              <span className={styles.heroAccent}>360°</span>
            </h2>
            <p className={styles.heroPara}>
              Discover the best properties, connect with trusted agents, and
              make smart real estate decisions.
            </p>
          </div>

          <div className={styles.statsGrid}>
            <Stat icon={<Home size={22} />} value="10K+" label="Properties" />
            <Stat icon={<Users size={22} />} value="500+" label="Agents" />
            <Stat icon={<MapPin size={22} />} value="50+" label="Cities" />
          </div>
        </div>
      </div>

      {/* ─── Right Panel ─── */}
      <div className={styles.rightPanel}>
        {/* Mobile logo */}
        <div className={styles.mobileLogo}>
          <img
            src={logo}
            alt="Zameen 360"
            className={styles.mobileLogoImg}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={styles.card}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

function Stat({ icon, value, label }: StatProps) {
  return (
    <div className={styles.stat}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}
