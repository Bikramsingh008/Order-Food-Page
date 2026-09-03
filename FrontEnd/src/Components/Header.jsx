import React, { useState, useRef, useEffect } from "react";
import "./Header.css";
import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUserShield,
  FaUser,
  FaBox,
  FaSignOutAlt,
  FaChevronDown,
  FaHome,
  FaUtensils,
  FaInfoCircle,
} from "react-icons/fa";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { getCartoonAvatar } from "../utils/avatar";

const Header = ({ count }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/signin");
  };

  const navLinks = [
    { to: "/", label: "Home", icon: <FaHome />, end: true },
    { to: "/ourfood", label: "Menu", icon: <FaUtensils /> },
    { to: "/aboutus", label: "About", icon: <FaInfoCircle /> },
  ];

  const userAvatarUrl = getCartoonAvatar(user);

  return (
    <>
      <header className="yf-header">
        <div className="yf-header-inner">
          {/* Logo */}
          <Link to="/" className="yf-logo">
            <div className="yf-logo-icon">🍔</div>
            <span className="yf-logo-text">
              Yummy<span>Food</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Main navigation">
            <ul className="yf-nav">
              {navLinks.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      isActive ? "active-link" : ""
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
              {user?.role === "admin" && (
                <li>
                  <NavLink to="/admin" className="yf-admin-pill">
                    <FaUserShield /> Admin Panel
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>

          {/* Right actions */}
          <div className="yf-header-actions">
            {/* Cart icon — hidden for admin */}
            {user?.role !== "admin" && (
              <Link to="/cart" className="yf-cart-btn" aria-label="View Cart">
                <FaShoppingCart />
                {count > 0 && <span className="yf-cart-badge">{count}</span>}
              </Link>
            )}

            {/* Auth section */}
            {!user ? (
              <div className="yf-auth-btn-wrap">
                <Link
                  to="/signin"
                  className="brand-btn yf-header-signin-btn"
                  style={{ padding: "9px 20px", fontSize: "0.88rem" }}
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <div ref={dropdownRef} style={{ position: "relative" }}>
                {/* Cool Cartoon Avatar Chip Button */}
                <button
                  type="button"
                  className="yf-user-chip"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                  aria-label="User profile menu"
                >
                  <img
                    src={userAvatarUrl}
                    alt={user.name || "User Avatar"}
                    className="yf-avatar-img"
                  />
                  <span className="yf-user-name">
                    {user.role === "admin" ? "Admin" : user.name}
                  </span>
                  <FaChevronDown
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(255, 255, 255, 0.6)",
                      transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {dropdownOpen && (
                  <div className="yf-profile-dropdown">
                    <div className="dropdown-user-header">
                      <div className="dropdown-user-name">{user.name}</div>
                      <div className="dropdown-user-email">{user.email}</div>
                    </div>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/profile?tab=info");
                      }}
                      className="dropdown-menu-item"
                    >
                      <FaUser style={{ color: "var(--brand-orange)" }} /> My Profile Details
                    </button>

                    {user.role !== "admin" && (
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/myorders");
                        }}
                        className="dropdown-menu-item"
                      >
                        <FaBox style={{ color: "var(--brand-orange)" }} /> My Orders & Live Status
                      </button>
                    )}

                    {user.role === "admin" && (
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/admin");
                        }}
                        className="dropdown-menu-item"
                      >
                        <FaUserShield style={{ color: "#EF4444" }} /> Admin Dashboard
                      </button>
                    )}

                    <div className="dropdown-divider">
                      <button
                        onClick={handleLogout}
                        className="dropdown-logout-btn"
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile hamburger toggle */}
            <button
              className="yf-mobile-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation drawer"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Out Drawer Menu */}
        {menuOpen && (
          <div className="yf-mobile-drawer-backdrop" onClick={() => setMenuOpen(false)}>
            <div
              className="yf-mobile-drawer"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-drawer-header">
                <div className="yf-logo">
                  <div className="yf-logo-icon">🍔</div>
                  <span className="yf-logo-text">
                    Yummy<span>Food</span>
                  </span>
                </div>
                <button
                  className="close-drawer-btn"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <FaTimes />
                </button>
              </div>

              {user && (
                <div className="drawer-user-card">
                  <img
                    src={userAvatarUrl}
                    alt={user.name}
                    className="drawer-avatar"
                  />
                  <div>
                    <div className="drawer-user-name">{user.name}</div>
                    <div className="drawer-user-email">{user.email}</div>
                  </div>
                </div>
              )}

              <div className="drawer-nav-list">
                {navLinks.map(({ to, label, icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `drawer-nav-item ${isActive ? "active" : ""}`
                    }
                  >
                    <span className="drawer-nav-icon">{icon}</span>
                    <span>{label}</span>
                  </NavLink>
                ))}

                <NavLink
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `drawer-nav-item ${isActive ? "active" : ""}`
                  }
                >
                  <span className="drawer-nav-icon"><FaShoppingCart /></span>
                  <span>My Cart</span>
                  {count > 0 && <span className="drawer-badge">{count} items</span>}
                </NavLink>

                {user && (
                  <>
                    <NavLink
                      to="/profile?tab=info"
                      onClick={() => setMenuOpen(false)}
                      className="drawer-nav-item"
                    >
                      <span className="drawer-nav-icon"><FaUser /></span>
                      <span>My Profile</span>
                    </NavLink>
                    {user.role !== "admin" && (
                      <NavLink
                        to="/myorders"
                        onClick={() => setMenuOpen(false)}
                        className="drawer-nav-item"
                      >
                        <span className="drawer-nav-icon"><FaBox /></span>
                        <span>My Orders & Tracking</span>
                      </NavLink>
                    )}
                  </>
                )}

                {user?.role === "admin" && (
                  <NavLink
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="drawer-nav-item admin-item"
                  >
                    <span className="drawer-nav-icon"><FaUserShield /></span>
                    <span>Admin Dashboard</span>
                  </NavLink>
                )}
              </div>

              <div className="drawer-footer">
                {!user ? (
                  <Link
                    to="/signin"
                    className="brand-btn drawer-btn"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign In / Register
                  </Link>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="drawer-logout-btn"
                  >
                    <FaSignOutAlt /> Log Out
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Modern Persistent Mobile Bottom Navigation Bar */}
      <nav className="yf-bottom-nav" aria-label="Mobile bottom navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? "active" : ""}`
          }
        >
          <FaHome className="bottom-nav-icon" />
          <span className="bottom-nav-label">Home</span>
        </NavLink>

        <NavLink
          to="/ourfood"
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? "active" : ""}`
          }
        >
          <FaUtensils className="bottom-nav-icon" />
          <span className="bottom-nav-label">Menu</span>
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `bottom-nav-item bottom-nav-cart ${isActive ? "active" : ""}`
          }
        >
          <div className="bottom-nav-cart-wrapper">
            <FaShoppingCart className="bottom-nav-icon" />
            {count > 0 && (
              <span className="bottom-nav-cart-badge">{count}</span>
            )}
          </div>
          <span className="bottom-nav-label">Cart</span>
        </NavLink>

        <NavLink
          to={user ? "/myorders" : "/signin"}
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? "active" : ""}`
          }
        >
          <FaBox className="bottom-nav-icon" />
          <span className="bottom-nav-label">Orders</span>
        </NavLink>

        <NavLink
          to={user ? "/profile" : "/signin"}
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? "active" : ""}`
          }
        >
          {user ? (
            <img
              src={userAvatarUrl}
              alt="Profile"
              className="bottom-nav-avatar"
            />
          ) : (
            <FaUser className="bottom-nav-icon" />
          )}
          <span className="bottom-nav-label">
            {user ? "Account" : "Sign In"}
          </span>
        </NavLink>
      </nav>

      {/* Floating cart pill (hidden on mobile, visible on desktop/tablets) */}
      <Link to="/cart" className="yf-cart-float" aria-label="View Floating Cart">
        <span className="yf-cart-float-badge">{count}</span>
        <FaShoppingCart size={20} color="#FF6B00" />
      </Link>
    </>
  );
};

export default Header;
