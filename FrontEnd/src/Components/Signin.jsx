import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../utils/api";
import { FaUser, FaUserShield, FaInfoCircle } from "react-icons/fa";
import "./Signin.css";

const Signin = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAutofillAdmin = () => {
    setForm({
      email: "admin@forever.com",
      password: "qwerty123",
    });
    toast.info("Demo Admin credentials filled!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const endpoint = isAdminMode
        ? `${API_URL}/user/admin`
        : `${API_URL}/user/login`;

      const res = await axios.post(endpoint, form, {
        withCredentials: true,
      });

      if (res.data.success) {
        // Ensure user object has role set correctly
        const userObj = res.data.user || {};
        if (isAdminMode) {
          userObj.role = "admin";
        }

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(userObj));

        if (isAdminMode || userObj.role === "admin") {
          toast.success("🔑 Admin Authentication Successful! Opening Dashboard...");
          navigate("/admin");
        } else {
          toast.success(`Welcome back, ${userObj.name || "Foodie"}!`);
          const redirectUrl = sessionStorage.getItem("redirectUrl");
          if (redirectUrl) {
            sessionStorage.removeItem("redirectUrl");
            navigate(redirectUrl);
          } else {
            navigate("/");
          }
        }
      } else {
        toast.error(res.data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Authentication failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        {/* Customer vs Admin Mode Tabs */}
        <div className="auth-role-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${!isAdminMode ? "active" : ""}`}
            onClick={() => {
              setIsAdminMode(false);
              setForm({ email: "", password: "" });
            }}
          >
            <FaUser /> Customer Login
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${isAdminMode ? "active-admin" : ""}`}
            onClick={() => {
              setIsAdminMode(true);
              setForm({ email: "", password: "" });
            }}
          >
            <FaUserShield /> Sign In as Admin
          </button>
        </div>

        <h2 className="signin-title">
          {isAdminMode ? "Admin Portal Sign In" : "Welcome Back!"}
        </h2>
        <p className="signin-sub">
          {isAdminMode
            ? "Enter system administrator credentials to access management console."
            : "Sign in to order your favorite dishes & customize recipes."}
        </p>

        {isAdminMode && (
          <>
            <div className="admin-login-notice">
              <FaInfoCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <b>Administrator Access</b>
                <p style={{ margin: "2px 0 0", color: "#FCA5A5", fontSize: "0.78rem" }}>
                  Authorized store admins can manage orders, products, and categories.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="admin-autofill-btn"
              onClick={handleAutofillAdmin}
            >
              ⚡ Auto-Fill Demo Admin Credentials (admin@forever.com)
            </button>
          </>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{isAdminMode ? "Admin Email" : "Email Address"}</label>
            <input
              type="email"
              name="email"
              placeholder={isAdminMode ? "admin@forever.com" : "you@example.com"}
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className={`signin-button ${isAdminMode ? "admin-btn-mode" : ""}`}
            disabled={loading}
          >
            {loading
              ? "Authenticating..."
              : isAdminMode
              ? "🔑 Login to Admin Panel"
              : "Sign In"}
          </button>
        </form>

        {!isAdminMode && (
          <p className="signup-link">
            Don't have an account? <Link to="/signup">Create one now</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Signin;
