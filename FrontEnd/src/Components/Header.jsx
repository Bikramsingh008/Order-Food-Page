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
} from "react-icons/fa";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { getCartoonAvatar } from "../utils/avatar";

const Header = ({ count }) => {
  const navigate = useNavigate();
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/signin");
  };

  const navLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/ourfood", label: "Menu" },
    { to: "/aboutus", label: "About" },
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
          <nav>
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
            {/* Cart icon */}
            <Link to="/cart" className="yf-cart-btn" aria-label="View Cart">
              <FaShoppingCart />
              {count > 0 && <span className="yf-cart-badge">{count}</span>}
            </Link>

            {/* Auth section */}
            {!user ? (
              <div style={{ display: "flex", gap: "8px" }}>
                <Link
                  to="/signin"
                  className="brand-btn"
                  style={{ padding: "10px 22px", fontSize: "0.88rem" }}
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <div
                ref={dropdownRef}
                style={{ position: "relative" }}
              >
                {/* Cool Cartoon Avatar Chip Button */}
                <button
                  type="button"
                  className="yf-user-chip"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    cursor: "pointer",
                    padding: "4px 12px 4px 4px",
                    borderRadius: "999px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "var(--transition)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  <img
                    src={userAvatarUrl}
                    alt={user.name || "User Avatar"}
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      background: "#111",
                      border: "1px solid var(--brand-orange)",
                    }}
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

                {/* Profile Dropdown Menu containing My Orders & Logout */}
                {dropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "48px",
                      right: 0,
                      width: "230px",
                      background: "rgba(16, 16, 16, 0.96)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "var(--radius-md)",
                      boxShadow: "0 12px 36px rgba(0, 0, 0, 0.7)",
                      padding: "8px",
                      zIndex: 1000,
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      animation: "fadeIn 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        padding: "10px 12px",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                        marginBottom: "4px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.92rem",
                          color: "#FFF",
                        }}
                      >
                        {user.name}
                      </div>
                      <div
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--text-muted)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {user.email}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/profile?tab=info");
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 12px",
                        background: "transparent",
                        border: "none",
                        color: "#E0E0E0",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                        width: "100%",
                        textAlign: "left",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255, 107, 0, 0.12)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <FaUser style={{ color: "var(--brand-orange)" }} /> My
                      Profile Details
                    </button>

                    {user.role !== "admin" && (
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/profile?tab=orders");
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 12px",
                          background: "transparent",
                          border: "none",
                          color: "#E0E0E0",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          borderRadius: "var(--radius-sm)",
                          cursor: "pointer",
                          width: "100%",
                          textAlign: "left",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(255, 107, 0, 0.12)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <FaBox style={{ color: "var(--brand-orange)" }} /> My
                        Orders & Live Status
                      </button>
                    )}

                    <div
                      style={{
                        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                        marginTop: "4px",
                        paddingTop: "4px",
                      }}
                    >
                      <button
                        onClick={handleLogout}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 12px",
                          background: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                          color: "#EF4444",
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          borderRadius: "var(--radius-sm)",
                          cursor: "pointer",
                          width: "100%",
                          textAlign: "left",
                        }}
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile toggle */}
            <button
              className="yf-mobile-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            style={{
              position: "fixed",
              top: "72px",
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(10, 10, 10, 0.98)",
              backdropFilter: "blur(20px)",
              zIndex: 999,
              display: "flex",
              flexDirection: "column",
              padding: "24px",
              gap: "12px",
              overflowY: "auto",
              maxHeight: "calc(100vh - 72px)",
              animation: "fadeIn 0.2s ease",
            }}
          >
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                style={({ isActive }) => ({
                  padding: "16px 20px",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: isActive ? "var(--brand-orange)" : "var(--text-white)",
                  background: isActive
                    ? "rgba(255, 107, 0, 0.1)"
                    : "rgba(255, 255, 255, 0.04)",
                  borderRadius: "var(--radius-sm)",
                  textDecoration: "none",
                  border: `1px solid ${
                    isActive
                      ? "rgba(255, 107, 0, 0.2)"
                      : "rgba(255, 255, 255, 0.06)"
                  }`,
                })}
              >
                {label}
              </NavLink>
            ))}

            {user && (
              <>
                <NavLink
                  to="/profile?tab=info"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    padding: "16px 20px",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "var(--text-white)",
                    background: "rgba(255, 255, 255, 0.04)",
                    borderRadius: "var(--radius-sm)",
                    textDecoration: "none",
                  }}
                >
                  👤 My Profile & Cartoon Avatar
                </NavLink>
                {user.role !== "admin" && (
                  <NavLink
                    to="/profile?tab=orders"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      padding: "16px 20px",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "var(--text-white)",
                      background: "rgba(255, 255, 255, 0.04)",
                      borderRadius: "var(--radius-sm)",
                      textDecoration: "none",
                    }}
                  >
                    📦 My Orders & Live Tracking
                  </NavLink>
                )}
              </>
            )}

            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: "16px 20px",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#EF4444",
                  background: "rgba(239, 68, 68, 0.12)",
                  borderRadius: "var(--radius-sm)",
                  textDecoration: "none",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                }}
              >
                ⚙️ Admin Dashboard
              </NavLink>
            )}

            {!user ? (
              <Link
                to="/signin"
                className="brand-btn"
                onClick={() => setMenuOpen(false)}
                style={{
                  marginTop: "16px",
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                Sign In
              </Link>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                style={{
                  marginTop: "16px",
                  padding: "16px",
                  background: "rgba(239, 68, 68, 0.15)",
                  color: "#EF4444",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Logout
              </button>
            )}
          </div>
        )}
      </header>

      {/* Floating cart pill (side) */}
      <Link to="/cart" className="yf-cart-float" aria-label="View Floating Cart">
        <span className="yf-cart-float-badge">{count}</span>
        <FaShoppingCart size={20} color="#FF6B00" />
      </Link>
    </>
  );
};

export default Header;
