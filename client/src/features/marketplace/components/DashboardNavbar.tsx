import logo from "../../../assets/chatgpt_image_may_12__2026__11_24_22_pm_720-removebg-preview.png";
import styles from '../styles/dashboardNavbar.module.css'
import { Link } from "react-router-dom";

function DashboardNavbar() {
  return (
    <>
      <nav className={styles.navbar}>
        <Link to="/">
          <img className={styles.logo} src={logo} alt="Zameen 360 logo" />
        </Link>

        <ul className={styles.navLinks}>
        
          <li><Link to="/">Home</Link></li>
          <li>Buy</li>
          <li>Rent</li>
          <li>Sell</li>
          <li>Projects</li>
          <li>About Us</li>
          <li>Contact</li>
        </ul>

        <div className={styles.navActions}>
          <button className={styles.loginButton}>Login</button>
          <button className={styles.postPropertyButton}>Post Property</button>
        </div>
      </nav>
    </>
  )
}

export default DashboardNavbar;