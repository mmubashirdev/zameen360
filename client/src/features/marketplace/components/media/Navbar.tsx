import React from 'react';
import styles from './styles/Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>Home</span>
          <span>
            Zameen <span className={styles.logoAccent}>360</span>
          </span>
        </div>
        <ul className={styles.links}>
          <li>Home</li>
          <li>Buy</li>
          <li>Rent</li>
          <li>Projects</li>
          <li>Agents</li>
          <li>Contact</li>
        </ul>
      </div>
      <div className={styles.right}>
        <button className={styles.postBtn} type="button">
          Post Property
        </button>
        <span className={styles.icon}>Search</span>
        <span className={styles.icon}>Alerts</span>
        <div className={styles.avatar}>Me</div>
      </div>
    </nav>
  );
};

export default Navbar;
