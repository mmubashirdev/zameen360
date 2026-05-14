import styles from "../styles/auth.module.css";
import { FOOTER_ADVANTAGES } from "../constants/authConstants";

export default function AuthFooter() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.footerGrid}>
        {FOOTER_ADVANTAGES.map((item, index) => (
          <div key={index} className={styles.footerItem}>
            <div className={styles.footerItemIcon}>
              <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
            </div>
            <div className={styles.footerItemText}>
              {item.title}
              <small>{item.desc}</small>
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}