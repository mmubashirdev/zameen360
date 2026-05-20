import { Search, Bell, ChevronDown, Home } from 'lucide-react';
import styles from '../PostProperty/styles/Navbar.module.css';

const Navbar = () => {
  const navLinks = ['Home', 'Buy', 'Rent', 'Projects', 'Agents', 'Contact'];

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Home className={styles.logoIcon} />
        <span className={styles.logoText}>Zameen <span className={styles.logoAccent}>360</span></span>
      </div>

      <ul className={styles.navLinks}>
        {navLinks.map((link) => (
          <li key={link} className={styles.navItem}>{link}</li>
        ))}
      </ul>

      <div className={styles.navActions}>
        <button className={styles.postBtn}>Post Property</button>
        <Search className={styles.icon} />
        <div className={styles.notification}>
          <Bell className={styles.icon} />
          <span className={styles.badge}>3</span>
        </div>
        <div className={styles.profile}>
          <img src="https://i.pravatar.cc/40" alt="profile" />
          <ChevronDown size={16} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;