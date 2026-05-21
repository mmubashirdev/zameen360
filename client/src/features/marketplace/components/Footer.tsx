import styles from "../styles/footer.module.css";
import { FaPhone } from "react-icons/fa";
import { footerColumnsData, contactInfoData } from "../data/footerData";
import { useState } from "react";

function Footer() {
  const [developer] = useState("Mubashir");
  return (
    <footer className={styles.footerWrapper}>
      {/* CTA Top Section */}
      <div className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Ready to Find Your Perfect Property?
            </h2>
            <p className={styles.ctaSubtitle}>
              Explore thousands of properties or list your own with ease.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.exploreBtn}>Explore Now</button>
              <button className={styles.getStartedBtn}>Get Started</button>
            </div>
          </div>

          <div className={styles.mapContainer}>
            <iframe
              className={styles.mapIframe}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d349889.79599362984!2d74.00471980621096!3d31.483103657492336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483e58107d9%3A0xc23abe6ccc7e2462!2sLahore%2C%20Pakistan!5e1!3m2!1sen!2s!4v1779377606328!5m2!1sen!2s"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className={styles.mainFooter}>
        <div className={styles.container}>
          {/* Brand & Contact Column */}
          <div className={styles.brandCol}>
            <h2 className={styles.logo}>
              Zameen <span>360</span>
            </h2>
            <p className={styles.brandDesc}>
              Pakistan's emerging real estate platform to buy, rent, and sell
              properties seamlessly.
            </p>

            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <FaPhone style={{ marginRight: "8px" }} />{" "}
                {contactInfoData.phone}
              </div>
              <div className={styles.contactItem}>
                <span className={styles.icon}>
                  <i className="fa-solid fa-envelope"></i>
                </span>{" "}
                {contactInfoData.email}
              </div>
              <div className={styles.contactItem}>
                <span className={styles.icon}>
                  <i className="fa-solid fa-location-dot"></i>
                </span>{" "}
                {contactInfoData.address}
              </div>
            </div>

            <div className={styles.appBadges}>
              <a href="#" className={styles.storeBadge}>
                <i className="fa-brands fa-apple"></i>
                <div className={styles.badgeText}>
                  <span>Download on the</span>
                  <strong>App Store</strong>
                </div>
              </a>
              <a href="#" className={styles.storeBadge}>
                <i className="fa-brands fa-google-play"></i>
                <div className={styles.badgeText}>
                  <span>GET IT ON</span>
                  <strong>Google Play</strong>
                </div>
              </a>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {footerColumnsData.map((column, index) => (
            <div className={styles.linkCol} key={index}>
              <h3 className={styles.colTitle}>{column.title}</h3>
              <ul className={styles.linkList}>
                {column.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.path} className={styles.link}>
                      {link.label}
                    </a>
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
          <p className={styles.copyright}>
            {developer} © 2026 Zameen 360. All rights reserved.
          </p>
          <div className={styles.socials}>
            <a href="#" className={styles.socialIcon} aria-label="Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" className={styles.socialIcon} aria-label="Twitter">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="#" className={styles.socialIcon} aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#" className={styles.socialIcon} aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
