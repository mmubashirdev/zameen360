import styles from "../styles/footer.module.css";
import { footerColumnsData, contactInfoData } from "../data/footerData";

function Footer() {
  return (
    <footer className={styles.footerWrapper}>
      {/* CTA Top Section */}
      <div className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Find Your Perfect Property?</h2>
          <p className={styles.ctaSubtitle}>Explore thousands of properties or list your own with ease.</p>
          <div className={styles.ctaButtons}>
            <button className={styles.exploreBtn}>Explore Now</button>
            <button className={styles.getStartedBtn}>Get Started</button>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className={styles.mainFooter}>
        <div className={styles.container}>
          
          {/* Brand & Contact Column */}
          <div className={styles.brandCol}>
            <h2 className={styles.logo}>Zameen <span>360</span></h2>
            <p className={styles.brandDesc}>
              Pakistan's leading real estate platform to buy, rent, and sell properties seamlessly.
            </p>
            
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <span className={styles.icon}>📞</span> {contactInfoData.phone}
              </div>
              <div className={styles.contactItem}>
                <span className={styles.icon}>✉️</span> {contactInfoData.email}
              </div>
              <div className={styles.contactItem}>
                <span className={styles.icon}>📍</span> {contactInfoData.address}
              </div>
            </div>

            <div className={styles.appBadges}>
              <div className={styles.badge}>Google Play</div>
              <div className={styles.badge}>App Store</div>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {footerColumnsData.map((column, index) => (
            <div className={styles.linkCol} key={index}>
              <h3 className={styles.colTitle}>{column.title}</h3>
              <ul className={styles.linkList}>
                {column.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.path} className={styles.link}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomContainer}>
          <p className={styles.copyright}>© 2026 Zameen 360. All rights reserved.</p>
          <div className={styles.socials}>
            <a href="#" className={styles.socialIcon}>FB</a>
            <a href="#" className={styles.socialIcon}>TW</a>
            <a href="#" className={styles.socialIcon}>IG</a>
            <a href="#" className={styles.socialIcon}>LI</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;