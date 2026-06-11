import Logostyles from "../../marketplace/components/media/styles/Navbar.module.css";
import styles from "../styles/dashboardNavbar.module.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../auth/context/useAuthContext";
import { useUser } from "../components/profile/UserContext";
import { useBuyer } from "../components/profile/BuyerContext";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  Home,
  X,
  User,
  Settings,
  LogOut,
  List,
  Heart,
} from "lucide-react";

// Hidden when modal is open (controlled by body class)
const AuthenticatedNavbar = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuthContext();
  const { user: sellerProfile } = useUser();
  const { buyer: buyerProfile } = useBuyer();

  // Get user data from multiple sources for sync
  const storedUser = JSON.parse(localStorage.getItem('zameen360_user') || '{}');
  const rawRole = (authUser as any)?.role || storedUser.role || '';
  const userRole = String(rawRole).toUpperCase();
  
  const userName = 
    sellerProfile?.fullName || 
    buyerProfile?.fullName || 
    (authUser as any)?.fullName || 
    storedUser.fullName || 
    "User";
  
  // ⭐ Profile image from CURRENT context (always latest)
  const profileImage = 
    sellerProfile?.profilePicture || 
    buyerProfile?.profilePicture || 
    storedUser.profilePicture || 
    null;
  
  const userEmail = 
    sellerProfile?.email || 
    buyerProfile?.email || 
    (authUser as any)?.email || 
    storedUser.email || 
    "";

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const avatarRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Sync profile image to localStorage whenever it changes
  useEffect(() => {
    if (profileImage) {
      const currentStored = JSON.parse(localStorage.getItem('zameen360_user') || '{}');
      if (currentStored.profilePicture !== profileImage) {
        currentStored.profilePicture = profileImage;
        localStorage.setItem('zameen360_user', JSON.stringify(currentStored));
      }
    }
  }, [profileImage]);

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

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

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
    localStorage.removeItem("zameen360_token");
    localStorage.removeItem("zameen360_user");
    navigate("/login");
    window.location.reload();
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

  const handleProfileClick = () => {
    if (userRole === 'BUYER') {
      navigate("/buyer-profile");
    } else {
      navigate("/profile");
    }
    setMenuOpen(false);
  };

  const handlePostPropertyClick = () => {
    if (userRole === 'BUYER') {
      alert("Only Sellers can post properties.\n\nPlease switch to Seller from your profile.");
      navigate('/buyer-profile');
    } else {
      navigate("/post-property");
    }
  };

  return (
    <>
      <nav className={`${styles.authenticatedNavbar} navbar-main`}>
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

        <ul className={`${styles.authNavLinks} ${searchOpen ? styles.authNavLinksHidden : ""}`}>
          {[
            { to: "/", label: "Home" },
            { to: "/buy", label: "Buy" },
            { to: "/rent", label: "Rent" },
            { to: "/sell", label: "Sell" },
            { to: "/projects", label: "Projects" },
            { to: "/about-us", label: "About Us" },
            { to: "/contact-us", label: "Contact" },
          ].map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  isActive ? `${styles.authNavLink} ${styles.authActiveLink}` : styles.authNavLink
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className={styles.authNavRight}>
          {userRole === 'SELLER' && (
            <button
              className={`${styles.authPostBtn} ${searchOpen ? styles.authPostBtnHidden : ""}`}
              onClick={handlePostPropertyClick}
            >
              + Post Property
            </button>
          )}

          <div className={styles.searchContainer} ref={searchRef}>
            <div className={`${styles.searchWrapper} ${searchOpen ? styles.searchWrapperOpen : ""}`}>
              {searchOpen && (
                <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                  <input
                    ref={searchInputRef}
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className={styles.searchClearBtn}
                      onClick={() => {
                        setSearchQuery("");
                        searchInputRef.current?.focus();
                      }}
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
              >
                {searchOpen ? <X size={18} strokeWidth={2.2} /> : <Search size={18} strokeWidth={2.2} />}
              </button>
            </div>
          </div>

          <div className={styles.notificationContainer}>
            <button className={styles.authIconBtn} title="Notifications">
              <Bell size={18} strokeWidth={2.2} />
            </button>
            <span className={styles.notificationBadge}>3</span>
          </div>

          <div className={styles.authNavDivider} />

          <div className={styles.authAvatarContainer} ref={avatarRef}>
            <button
              className={`${styles.authAvatarBtn} ${menuOpen ? styles.authAvatarBtnActive : ""}`}
              onClick={() => setMenuOpen((s) => !s)}
              title={userName}
            >
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="profile" 
                  className={styles.authAvatar}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
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
                <div className={styles.authDropdownMenu}>
                  <div className={styles.dropdownUserInfo}>
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="profile" 
                        className={styles.dropdownAvatar}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div className={styles.dropdownAvatarFallback}>
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className={styles.dropdownUserText}>
                      <strong>{userName}</strong>
                      <small>{userEmail}</small>
                      {userRole && (
                        <span style={{
                          fontSize: '10px',
                          color: userRole === 'SELLER' ? '#f59e0b' : '#10b981',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          display: 'block',
                          marginTop: '2px'
                        }}>
                          {userRole}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.dropdownDivider} />

                  <button className={styles.authDropdownItem} onClick={handleProfileClick}>
                    <User size={16} strokeWidth={2} className={styles.dropdownItemIcon} />
                    <span>My Profile</span>
                  </button>

                  {userRole === 'SELLER' && (
                    <button
                      className={styles.authDropdownItem}
                      onClick={() => {
                        navigate("/my-listings");
                        setMenuOpen(false);
                      }}
                    >
                      <List size={16} strokeWidth={2} className={styles.dropdownItemIcon} />
                      <span>My Listings</span>
                    </button>
                  )}

                  {userRole === 'BUYER' && (
                    <button
                      className={styles.authDropdownItem}
                      onClick={() => {
                        navigate("/saved-properties");
                        setMenuOpen(false);
                      }}
                    >
                      <Heart size={16} strokeWidth={2} className={styles.dropdownItemIcon} />
                      <span>Saved Properties</span>
                    </button>
                  )}

                  <button
                    className={styles.authDropdownItem}
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

      {searchOpen && (
        <div className={styles.searchOverlay} onClick={() => setSearchOpen(false)} />
      )}
    </>
  );
};

const UnauthenticatedNavbar = () => {
  const navigate = useNavigate();
  return (
    <nav className={`${styles.navbar} navbar-main`}>
      <Link to="/">
        <div className={Logostyles.logo}>
          <span>Zameen<span className={Logostyles.logoAccent}>360</span></span>
        </div>
      </Link>
      <ul className={styles.navLinks}>
        <li><NavLink to="/" className={({ isActive }) => (isActive ? styles.activeLink : "")}>Home</NavLink></li>
        <li><NavLink to="/buy" className={({ isActive }) => (isActive ? styles.activeLink : "")}>Buy</NavLink></li>
        <li><NavLink to="/rent" className={({ isActive }) => (isActive ? styles.activeLink : "")}>Rent</NavLink></li>
        <li><NavLink to="/sell" className={({ isActive }) => (isActive ? styles.activeLink : "")}>Sell</NavLink></li>
        <li><NavLink to="/projects" className={({ isActive }) => (isActive ? styles.activeLink : "")}>Projects</NavLink></li>
        <li><NavLink to="/about-us" className={({ isActive }) => (isActive ? styles.activeLink : "")}>About Us</NavLink></li>
        <li><NavLink to="/contact-us" className={({ isActive }) => (isActive ? styles.activeLink : "")}>Contact Us</NavLink></li>
      </ul>
      <div className={styles.navActions}>
        <button className={styles.loginButton} onClick={() => navigate("/login")}>Login</button>
        <button className={styles.postPropertyButton} onClick={() => navigate("/login")}>Post Property</button>
      </div>
    </nav>
  );
};

function DashboardNavbar() {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? <AuthenticatedNavbar /> : <UnauthenticatedNavbar />;
}

export default DashboardNavbar;