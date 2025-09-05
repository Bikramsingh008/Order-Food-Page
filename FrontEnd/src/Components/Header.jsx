import React from "react";
import "./Header.css";
import { FaCartShopping } from "react-icons/fa6";
import { NavLink, Link, useNavigate } from "react-router-dom";

const Header = ({ count }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <div className="Header">
      {/* Left side logo + username */}
      <div className="header-left">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <p>
            Yummy<span style={{ color: "rgb(233, 162, 22)" }}>Food</span>
          </p>
        </Link>
        {user && <span className="user-name">👤 {user.name}</span>}
      </div>

      {/* Navigation menu */}
      <ul className="parts">
        <li>
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/aboutus" className="nav-link">
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink to="/ourfood" className="nav-link">
            Our Food
          </NavLink>
        </li>

        {/* ✅ Show Admin Panel link only if admin */}
        {user?.role === "admin" && (
          <li>
            <NavLink to="/admin" className="nav-link">
              Admin Panel
            </NavLink>
          </li>
        )}

        {!user ? (
          <li>
            <NavLink to="/signin" className="nav-link">
              Sign In
            </NavLink>
          </li>
        ) : (
          <li>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </li>
        )}
      </ul>

      {/* Floating Cart button */}
      <Link to="/cart" style={{ textDecoration: "none", color: "white" }}>
        <div
          className="cart-slide"
          style={{
            position: "fixed",
            top: "50%",
            left: "0",
            transform: "translateY(-50%)",
            background: "#222",
            padding: "15px",
            borderRadius: "0 8px 8px 0",
            cursor: "pointer",
            fontSize: "30px",
            boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.3)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div style={{ fontSize: "16px", marginBottom: "5px" }}>{count}</div>
          <FaCartShopping />
        </div>
      </Link>
    </div>
  );
};

export default Header;
