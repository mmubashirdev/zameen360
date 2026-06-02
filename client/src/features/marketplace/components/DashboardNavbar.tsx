import Logostyles from "../../marketplace/components/media/styles/Navbar.module.css";
import styles from "../styles/dashboardNavbar.module.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../auth/context/useAuthContext";
import { useEffect, useRef, useState, useCallback } from "react";
import { Search, Bell, ChevronDown, Home, X, User, Settings, LogOut } from "lucide-react";

// ==================== AUTHENTICATED NAVBAR ====================
const AuthenticatedNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const currentUser = user as
    | { firstName?: string; fullName?: string; profileImage?: string; email?: string }
    | undefined;
  const profileImage = currentUser?.profileImage;

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const avatarRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close search on Escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }, [logout, navigate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchToggle = () => {
    if (searchOpen) {
      setSearchOpen(false);
      setSearchQuery("");
    } else {
      setSearchOpen(true);
    }
  };

  const userName = currentUser?.firstName || currentUser?.fullName || "User";

  return (
    <>
      <nav className={styles.authenticatedNavbar}>
        {/* LEFT — Logo */}
        <div className={styles.authNavLeft}>
          <Link to="/" className={styles.authLogoLink}>
            <div className={styles.authLogo}>
              <div className={styles.logoIconWrapper}>
                <Home size={20} strokeWidth={2.2} />
              </div>
              <span className={styles.logoText}>
                Zameen<span className={styles.logoAccent}>360</span>
              </span>
            </div>
          </Link>
        </div>

        {/* CENTER — Nav Links */}
        <ul className={`${styles.authNavLinks} ${searchOpen ? styles.authNavLinksHidden : ""}`}>
          {[
            { to: "/", label: "Home" },
            { to: "/buy", label: "Buy" },
            { to: "/rent", label: "Rent" },
            { to: "/sell", label: "Sell" },
            { to: "/projects", label: "Projects" },
            { to: "/about-us", label: "About Us" },
            { to: "/contact", label: "Contact" },
          ].map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.authNavLink} ${styles.authActiveLink}`
                    : styles.authNavLink
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* RIGHT — Actions */}
        <div className={styles.authNavRight}>
          {/* Post Property */}
          <button
            className={`${styles.authPostBtn} ${searchOpen ? styles.authPostBtnHidden : ""}`}
            onClick={() => navigate("/post-property")}
          >
            Post Property
          </button>

          {/* Search */}
          <div className={styles.searchContainer} ref={searchRef}>
            <div className={`${styles.searchWrapper} ${searchOpen ? styles.searchWrapperOpen : ""}`}>
              {searchOpen && (
                <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                  <input
                    ref={searchInputRef}
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search properties, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className={styles.searchClearBtn}
                      onClick={() => {
                        setSearchQuery("");
                        searchInputRef.current?.focus();
                      }}
                      aria-label="Clear search"
                    >
                      <X size={14} strokeWidth={2.5} />
                    </button>
                  )}
                </form>
              )}
              <button
                className={`${styles.authIconBtn} ${styles.searchToggleBtn} ${searchOpen ? styles.searchToggleBtnActive : ""}`}
                onClick={handleSearchToggle}
                title={searchOpen ? "Close search" : "Search"}
                aria-label={searchOpen ? "Close search" : "Open search"}
              >
                {searchOpen ? (
                  <X size={18} strokeWidth={2.2} />
                ) : (
                  <Search size={18} strokeWidth={2.2} />
                )}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className={styles.notificationContainer}>
            <button
              className={styles.authIconBtn}
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell size={18} strokeWidth={2.2} />
            </button>
            <span className={styles.notificationBadge}>3</span>
          </div>

          {/* Divider */}
          <div className={styles.authNavDivider} />

          {/* Avatar + Dropdown */}
          <div className={styles.authAvatarContainer} ref={avatarRef}>
            <button
              className={`${styles.authAvatarBtn} ${menuOpen ? styles.authAvatarBtnActive : ""}`}
              onClick={() => setMenuOpen((s) => !s)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              title={userName}
            >
              {profileImage ? (
                <img src={profileImage} alt="profile" className={styles.authAvatar} />
              ) : (
                <div className={styles.authAvatarFallback}>
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className={styles.avatarInfo}>
                <span className={styles.avatarName}>{userName}</span>
              </div>
              <ChevronDown
                size={14}
                strokeWidth={2.5}
                className={styles.chevron}
                style={{ transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {menuOpen && (
              <>
                <div className={styles.dropdownBackdrop} onClick={() => setMenuOpen(false)} />
                <div className={styles.authDropdownMenu} role="menu">
                  <div className={styles.dropdownUserInfo}>
                    {profileImage ? (
                      <img src={profileImage} alt="profile" className={styles.dropdownAvatar} />
                    ) : (
                      <div className={styles.dropdownAvatarFallback}>
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className={styles.dropdownUserText}>
                      <strong>{userName}</strong>
                      <small>{currentUser?.email}</small>
                    </div>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <button
                    className={styles.authDropdownItem}
                    role="menuitem"
                    onClick={() => {
                      navigate("/profile");
                      setMenuOpen(false);
                    }}
                  >
                    <User size={16} strokeWidth={2} className={styles.dropdownItemIcon} />
                    <span>My Profile</span>
                  </button>
                  <button
                    className={styles.authDropdownItem}
                    role="menuitem"
                    onClick={() => {
                      navigate("/settings");
                      setMenuOpen(false);
                    }}
                  >
                    <Settings size={16} strokeWidth={2} className={styles.dropdownItemIcon} />
                    <span>Settings</span>
                  </button>
                  <div className={styles.dropdownDivider} />
                  <button
                    className={`${styles.authDropdownItem} ${styles.authDropdownLogout}`}
                    role="menuitem"
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                  >
                    <LogOut size={16} strokeWidth={2} className={styles.dropdownItemIcon} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Search overlay for mobile */}
      {searchOpen && <div className={styles.searchOverlay} onClick={() => setSearchOpen(false)} />}
    </>
  );
};

// ==================== UNAUTHENTICATED NAVBAR ====================
const UnauthenticatedNavbar = () => {
  const navigate = useNavigate();

  const navigateToCreatePost = () => {
    navigate("/login");
  };

  return (
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
          <NavLink to="/" className={({ isActive }) => (isActive ? styles.activeLink : "")}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/buy" className={({ isActive }) => (isActive ? styles.activeLink : "")}>
            Buy
          </NavLink>
        </li>
        <li>
          <NavLink to="/rent" className={({ isActive }) => (isActive ? styles.activeLink : "")}>
            Rent
          </NavLink>
        </li>
        <li>
          <NavLink to="/sell" className={({ isActive }) => (isActive ? styles.activeLink : "")}>
            Sell
          </NavLink>
        </li>
        <li>
          <NavLink to="/projects" className={({ isActive }) => (isActive ? styles.activeLink : "")}>
            Projects
          </NavLink>
        </li>
        <li>
          <NavLink to="/about-us" className={({ isActive }) => (isActive ? styles.activeLink : "")}>
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? styles.activeLink : "")}>
            Contact
          </NavLink>
        </li>
      </ul>

      <div className={styles.navActions}>
        <button className={styles.loginButton} onClick={() => navigate("/login")}>
          Login
        </button>
        <button className={styles.postPropertyButton} onClick={navigateToCreatePost}>
          Post Property
        </button>
      </div>
    </nav>
  );
};

// ==================== MAIN DASHBOARD NAVBAR COMPONENT ====================
function DashboardNavbar() {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? <AuthenticatedNavbar /> : <UnauthenticatedNavbar />;
}

export default DashboardNavbar;