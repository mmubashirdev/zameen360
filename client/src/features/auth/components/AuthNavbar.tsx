import { Link } from "react-router-dom";
import styles from "../styles/auth.module.css";

export default function AuthNavbar() {
  return (
    <nav
      className={styles.navbar}
      role="navigation"
      aria-label="Main navigation"
    >
      <Link to="/" className={styles.navLogo}>
        <img
          className={styles.navLogoImg}
          src="https://z-cdn-media.chatglm.cn/files/8ecfdb5c-41b7-46cd-9808-b5cb303771d5.png?auth_key=1878622656-9379a6c556d7402a8d00fad834383a96-0-a4b6e6ca5ebfbff119124e83c08a6bb4"
          alt="Zameen 360 Logo"
        />
        <span className={styles.navLogoText}>
          Zameen<span>360</span>
        </span>
      </Link>
      <div className={styles.navRight}>
        <span>Already have an account?</span>
        <Link
          to="/login"
          className={styles.navLoginLink}
          aria-label="Login to your account"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}