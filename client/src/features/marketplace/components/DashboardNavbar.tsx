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
  Heart,
} from "lucide-react";
import NotificationDropdown from "../components/NotificationDropdown";
import socket from "@shared/lib/socket";
import axiosInstance from "@shared/lib/axios";

// ─── Custom hook: real-time unread message count ──────────────────────────────
const useUnreadCount = (currentUser: any) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchCount = useCallback(async () => {
    try {
      const result: any = await axiosInstance.get("/messages/unread-count");
      if (result.success) setUnreadCount(result.data.count);
    } catch (err) {
      console.error("unread count error:", err);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    if (!(currentUser?.userId || currentUser?.id)) return;
    fetchCount();
  }, [fetchCount, currentUser?.userId, currentUser?.id]);

  // Real-time socket increment
  useEffect(() => {
    if (!(currentUser?.userId || currentUser?.id)) return;
    const myId = Number(currentUser?.userId || currentUser?.id);

    const onReceiveMessage = (data: {
      message: any;
      conversationId: number;
    }) => {
      // Only count messages from OTHER users
      if (Number(data.message.senderId) === myId) return;
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("receive_message", onReceiveMessage);
    return () => {
      socket.off("receive_message", onReceiveMessage);
    };
  }, [currentUser?.userId, currentUser?.id]);

  // Reset when ChatWindow marks messages as read
  useEffect(() => {
    const handleRead = () => fetchCount();
    window.addEventListener("messages_marked_read", handleRead);
    return () => window.removeEventListener("messages_marked_read", handleRead);
  }, [fetchCount]);

  return { unreadCount, setUnreadCount };
};

// ─── Authenticated Navbar ─────────────────────────────────────────────────────
const AuthenticatedNavbar = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuthContext();
  const { user: sellerProfile } = useUser();
  const { buyer: buyerProfile } = useBuyer();

  const storedUser = JSON.parse(localStorage.getItem("zameen360_user") || "{}");
  const rawRole = (authUser as any)?.role || "";
  const userRole = String(rawRole).toUpperCase();

  const userName =
    sellerProfile?.fullName ||
    buyerProfile?.fullName ||
    (authUser as any)?.fullName ||
    storedUser.fullName ||
    "User";

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

  // ─── UI state ───────────────────────────────────────────────────────────────
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);

  // ─── Real unread count ──────────────────────────────────────────────────────
  const { unreadCount, setUnreadCount } = useUnreadCount(authUser);

  // ─── Refs ───────────────────────────────────────────────────────────────────
  const avatarRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  // ─── Sync profile image to localStorage ────────────────────────────────────
  useEffect(() => {
    if (profileImage) {
      const currentStored = JSON.parse(
        localStorage.getItem("zameen360_user") || "{}",
      );
      if (currentStored.profilePicture !== profileImage) {
        currentStored.profilePicture = profileImage;
        localStorage.setItem("zameen360_user", JSON.stringify(currentStored));
      }
    }
  }, [profileImage]);

  // ─── Outside click handler ──────────────────────────────────────────────────
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // ─── Focus search input when opened ────────────────────────────────────────
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // ─── Escape key handler ─────────────────────────────────────────────────────
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
        setNotificationOpen(false);
      }
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleLogout = useCallback(async () => {
    await logout();
    localStorage.removeItem("zameen360_user");
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

  const handleProfileClick = () => {
    if (userRole === "BUYER") {
      navigate("/buyer-profile");
    } else if (userRole === "SOCIETY_OWNER") {
      navigate("/profile");
    } else {
      navigate("/profile");
    }
    setMenuOpen(false);
  };

  const handlePostPropertyClick = () => {
    if (userRole === "BUYER") {
      alert(
        "⚠️ Only Sellers can post properties!\n\nPlease switch to Seller from your profile.",
      );
      navigate("/buyer-profile");
    } else {
      navigate("/post-property");
    }
  };

  // ─── Notification handlers ──────────────────────────────────────────────────
  const handleNotificationOpen = () => {
    setNotificationOpen((prev) => !prev);
  };

  const handleMarkAllRead = () => {
    setUnreadCount(0);
    setNotificationOpen(false);
  };

  const handleViewAll = () => {
    navigate("/messages");
    setNotificationOpen(false);
  };

  return (
    <>
      <nav className={`${styles.authenticatedNavbar} navbar-main`}>
        {/* ── Logo ─────────────────────────────────────────────────────────── */}
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

        {/* ── Nav Links ────────────────────────────────────────────────────── */}
        <ul
          className={`${styles.authNavLinks} ${
            searchOpen ? styles.authNavLinksHidden : ""
          }`}
        >
          {[
            { to: "/", label: "Home" },
            { to: "/buy", label: "Buy" },
            { to: "/rent", label: "Rent" },
            { to: "/societies", label: "Societies" },
            { to: "/about-us", label: "About Us" },
            { to: "/contact-us", label: "Contact Us" },
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

        {/* ── Right Side ───────────────────────────────────────────────────── */}
        <div className={styles.authNavRight}>
          {/* Post Property button (sellers & society owners) */}
          {(userRole === "SELLER" || userRole === "SOCIETY_OWNER") && (
            <button
              className={`${styles.authPostBtn} ${
                searchOpen ? styles.authPostBtnHidden : ""
              }`}
              onClick={handlePostPropertyClick}
            >
              + Post Property
            </button>
          )}

          {/* ── Search ───────────────────────────────────────────────────── */}
          <div className={styles.searchContainer} ref={searchRef}>
            <div
              className={`${styles.searchWrapper} ${
                searchOpen ? styles.searchWrapperOpen : ""
              }`}
            >
              {searchOpen && (
                <form
                  onSubmit={handleSearchSubmit}
                  className={styles.searchForm}
                >
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
                className={`${styles.authIconBtn} ${styles.searchToggleBtn} ${
                  searchOpen ? styles.searchToggleBtnActive : ""
                }`}
                onClick={handleSearchToggle}
                title={searchOpen ? "Close search" : "Search"}
              >
                {searchOpen ? (
                  <X size={18} strokeWidth={2.2} />
                ) : (
                  <Search size={18} strokeWidth={2.2} />
                )}
              </button>
            </div>
          </div>

          {/* ── Notification Bell ─────────────────────────────────────────── */}
          <div className={styles.notificationContainer} ref={notificationRef}>
            <button
              className={styles.authIconBtn}
              title="Notifications"
              onClick={handleNotificationOpen}
            >
              <Bell size={18} strokeWidth={2.2} />
            </button>

            {/* Real unread badge — only shown when count > 0 */}
            {unreadCount > 0 && (
              <span className={styles.notificationBadge}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}

            {/* Dropdown */}
            {notificationOpen && (
              <NotificationDropdown
                onClose={() => setNotificationOpen(false)}
                onMarkAllRead={handleMarkAllRead}
                onViewAll={handleViewAll}
              />
            )}
          </div>

          <div className={styles.authNavDivider} />

          {/* ── Avatar / Profile Menu ─────────────────────────────────────── */}
          <div className={styles.authAvatarContainer} ref={avatarRef}>
            <button
              className={`${styles.authAvatarBtn} ${
                menuOpen ? styles.authAvatarBtnActive : ""
              }`}
              onClick={() => setMenuOpen((s) => !s)}
              title={userName}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="profile"
                  className={styles.authAvatar}
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
                style={{
                  transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {menuOpen && (
              <>
                <div
                  className={styles.dropdownBackdrop}
                  onClick={() => setMenuOpen(false)}
                />
                <div className={styles.authDropdownMenu}>
                  {/* User info header */}
                  <div className={styles.dropdownUserInfo}>
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="profile"
                        className={styles.dropdownAvatar}
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
                        <span
                          style={{
                            fontSize: "10px",
                            color:
                              userRole === "SELLER" 
                                ? "#f59e0b" 
                                : userRole === "SOCIETY_OWNER"
                                ? "#8b5cf6"
                                : "#10b981",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            display: "block",
                            marginTop: "2px",
                          }}
                        >
                          {userRole === "SOCIETY_OWNER" ? "SOCIETY OWNER" : userRole}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.dropdownDivider} />

                  {/* My Profile */}
                  <button
                    className={styles.authDropdownItem}
                    onClick={handleProfileClick}
                  >
                    <User
                      size={16}
                      strokeWidth={2}
                      className={styles.dropdownItemIcon}
                    />
                    <span>My Profile</span>
                  </button>

                  {/* Saved Properties (buyers only) */}
                  {userRole === "BUYER" && (
                    <button
                      className={styles.authDropdownItem}
                      onClick={() => {
                        navigate("/saved-properties");
                        setMenuOpen(false);
                      }}
                    >
                      <Heart
                        size={16}
                        strokeWidth={2}
                        className={styles.dropdownItemIcon}
                      />
                      <span>Saved Properties</span>
                    </button>
                  )}

                  {/* Settings */}
                  <button
                    className={styles.authDropdownItem}
                    onClick={() => {
                      navigate("/settings");
                      setMenuOpen(false);
                    }}
                  >
                    <Settings
                      size={16}
                      strokeWidth={2}
                      className={styles.dropdownItemIcon}
                    />
                    <span>Settings</span>
                  </button>

                  <div className={styles.dropdownDivider} />

                  {/* Logout */}
                  <button
                    className={`${styles.authDropdownItem} ${styles.authDropdownLogout}`}
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                  >
                    <LogOut
                      size={16}
                      strokeWidth={2}
                      className={styles.dropdownItemIcon}
                    />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Search overlay */}
      {searchOpen && (
        <div
          className={styles.searchOverlay}
          onClick={() => setSearchOpen(false)}
        />
      )}
    </>
  );
};

// ─── Unauthenticated Navbar ───────────────────────────────────────────────────
const UnauthenticatedNavbar = () => {
  const navigate = useNavigate();
  return (
    <nav className={`${styles.navbar} navbar-main`}>
      <Link to="/">
        <div className={Logostyles.logo}>
          <span>
            Zameen<span className={Logostyles.logoAccent}>360</span>
          </span>
        </div>
      </Link>
      <ul className={styles.navLinks}>
        {[
          { to: "/", label: "Home" },
          { to: "/buy", label: "Buy" },
          { to: "/rent", label: "Rent" },
          { to: "/societies", label: "Societies" },
          { to: "/about-us", label: "About Us" },
          { to: "/contact-us", label: "Contact Us" },
        ].map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) => (isActive ? styles.activeLink : "")}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className={styles.navActions}>
        <button
          className={styles.loginButton}
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className={styles.postPropertyButton}
          onClick={() => navigate("/login")}
        >
          Post Property
        </button>
      </div>
    </nav>
  );
};

// ─── Export ───────────────────────────────────────────────────────────────────
function DashboardNavbar() {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? <AuthenticatedNavbar /> : <UnauthenticatedNavbar />;
}

export default DashboardNavbar;
