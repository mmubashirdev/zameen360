import Logostyles from "../../marketplace/components/media/styles/Navbar.module.css";
import styles from "../styles/dashboardNavbar.module.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../auth/context/useAuthContext";
import { useEffect, useRef, useState } from "react";

function DashboardNavbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthContext();
  const currentUser = user as
    | { firstName?: string; profileImage?: string }
    | undefined;
  const profileImage = currentUser?.profileImage;
  const [menuOpen, setMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (!avatarRef.current) return;
      if (!avatarRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const navigateToCreatePost = () => {
    if (isAuthenticated) {
      navigate("/post-property");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <nav className={styles.navbar}>
        <Link to="/">
          <div className={Logostyles.logo}>
            <span>
              Zameen<span className={Logostyles.logoAccent}>360</span>
            </span>
          </div>
        </Link>

        <ul className={styles.navLinks}>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? styles.activeLink : ""}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/buy" className={({ isActive }) => isActive ? styles.activeLink : ""}>Buy</NavLink>
          </li>
          <li>
            <NavLink to="/rent" className={({ isActive }) => isActive ? styles.activeLink : ""}>Rent</NavLink>
          </li>
          <li>
            <NavLink to="/sell" className={({ isActive }) => isActive ? styles.activeLink : ""}>Sell</NavLink>
          </li>
          <li>
            <NavLink to="/projects" className={({ isActive }) => isActive ? styles.activeLink : ""}>Projects</NavLink>
          </li>
          <li>
            <NavLink to="/about-us" className={({ isActive }) => isActive ? styles.activeLink : ""}>About Us</NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => isActive ? styles.activeLink : ""}>Contact</NavLink>
          </li>
        </ul>

        <div className={styles.navActions}>
          {isAuthenticated ? (
            <>
              {/* Post Property Button */}
              <button
                className={styles.postPropertyButton}
                onClick={navigateToCreatePost}
              >
                Post Property
              </button>

              {/* Avatar with dropdown (right-aligned) */}
              <div className={styles.avatarContainer} ref={avatarRef}>
                <button
                  className={styles.avatarButton}
                  onClick={() => setMenuOpen((s) => !s)}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="profile"
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarFallback}>
                      {currentUser?.firstName?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                  )}
                </button>

                {menuOpen && (
                  <div className={styles.dropdownMenu} role="menu">
                    <button
                      className={styles.dropdownItem}
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Login Button */}
              <button
                className={styles.loginButton}
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              {/* Post Property still visible but redirects to login */}
              <button
                className={styles.postPropertyButton}
                onClick={navigateToCreatePost}
              >
                Post Property
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}

export default DashboardNavbar;
