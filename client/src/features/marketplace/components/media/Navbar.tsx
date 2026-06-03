import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/Navbar.module.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo} onClick={() => handleNavClick('/')}>
          <span className={styles.logoIcon}>Home</span>
          <span>
            Zameen <span className={styles.logoAccent}>360</span>
          </span>
        </div>
        <ul className={styles.links}>
          <li onClick={() => handleNavClick('/')}>Home</li>
          <li onClick={() => handleNavClick('/buy')}>Buy</li>
          <li onClick={() => handleNavClick('/rent')}>Rent</li>
          <li onClick={() => handleNavClick('/rent')}>Projects</li>
          <li onClick={() => handleNavClick('/rent')}>Agents</li>
          <li onClick={() => handleNavClick('/contact-us')}>Contact</li>
        </ul>
      </div>
      <div className={styles.right}>
        <button className={styles.postBtn} type="button" onClick={() => handleNavClick('/post-property')}>
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
