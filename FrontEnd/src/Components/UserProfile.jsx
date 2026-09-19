import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import { getCartoonAvatar, STICKER_AVATARS } from "../utils/avatar";
import LiveAvatar from "./LiveAvatar";
import MyOrders from "./MyOrders";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaKey,
  FaSave,
  FaBox,
  FaSignOutAlt,
  FaSmile,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "./UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sliderRef = useRef(null);

  // Read initial tab from URL query param ?tab=orders
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") === "orders" ? "orders" : "info";

  const [activeTab, setActiveTab] = useState(initialTab);

  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -240 : 240;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const [formData, setFormData] = useState({
    name: localUser.name || "",
    email: localUser.email || "",
    phone: localUser.phone || "",
    address: localUser.address || "",
    gender: localUser.gender || "male",
    avatarUrl: localUser.avatarUrl || "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Sync with URL query parameter changes
  useEffect(() => {
    const tabParam = new URLSearchParams(location.search).get("tab");
    if (tabParam === "orders") {
      setActiveTab("orders");
    } else if (tabParam === "info") {
      setActiveTab("info");
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setFetching(false);
        return;
      }
      try {
        const res = await axios.get(`${API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success && res.data.user) {
          const u = res.data.user;
          setFormData((prev) => ({
            ...prev,
            name: u.name || prev.name,
            email: u.email || prev.email,
            phone: u.phone || "",
            address: u.address || "",
            gender: u.gender || "male",
            avatarUrl: u.avatarUrl || "",
          }));
          // Sync localStorage
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...localUser,
              name: u.name,
              email: u.email,
              phone: u.phone,
              address: u.address,
              gender: u.gender || "male",
              avatarUrl: u.avatarUrl || "",
            })
          );
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarSelect = (url) => {
    setFormData((prev) => ({ ...prev, avatarUrl: url }));
    toast.success("Sticker Avatar selected! Click 'Save Profile Details' to confirm.");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
    navigate("/signin");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/user/update-profile`,
        {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          gender: formData.gender,
          avatarUrl: formData.avatarUrl,
          newPassword: formData.newPassword || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("✨ Sticker Avatar & Profile details saved!");
        const updatedUser = {
          ...localUser,
          name: res.data.user.name,
          phone: res.data.user.phone,
          address: res.data.user.address,
          gender: res.data.user.gender,
          avatarUrl: res.data.user.avatarUrl,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setFormData((prev) => ({ ...prev, newPassword: "" }));
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const currentAvatar = getCartoonAvatar(formData);

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Header with Sticker Avatar */}
        <div className="profile-header">
          <div className="profile-avatar-wrapper">
            <LiveAvatar
              src={currentAvatar}
              alt={formData.name || "User"}
              size="lg"
            />
            <div className="profile-title-group">
              <h2>{formData.name || "My Account"}</h2>
              <p>{formData.email}</p>
              <div className="live-status-pill">
                <span className="live-dot"></span> Profile Badge
              </div>
            </div>
          </div>

          <div className="profile-header-actions">
            <button
              className="nav-btn"
              onClick={handleLogout}
              style={{
                padding: "10px 20px",
                background: "rgba(239, 68, 68, 0.15)",
                color: "#EF4444",
                borderRadius: "999px",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Integrated Navigation Tabs Bar */}
        <div className="profile-tabs-bar">
          <button
            className={`profile-tab-btn ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            <FaUser /> Account & Sticker Avatar
          </button>
          <button
            className={`profile-tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <FaBox /> My Orders & Live Stage Tracking
          </button>
        </div>

        {/* TAB 1: ACCOUNT DETAILS & STICKER AVATAR SELECTION */}
        {activeTab === "info" && (
          <div>
            {fetching ? (
              <p style={{ textAlign: "center", color: "#A0A0A0" }}>Loading account profile...</p>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Compact Horizontal Slider for Avatar Selection */}
                <div className="avatar-picker-section compact-slider-section">
                  <div className="avatar-picker-title">
                    <FaSmile style={{ color: "var(--brand-orange)", marginRight: "6px" }} /> Choose Avatar (Slide left/right for colors & expressions)
                  </div>

                  <div className="avatar-slider-wrapper">
                    <button
                      type="button"
                      className="avatar-slide-btn left"
                      onClick={() => scrollSlider("left")}
                      aria-label="Scroll left"
                    >
                      <FaChevronLeft />
                    </button>

                    <div className="avatar-slider-track" ref={sliderRef}>
                      {STICKER_AVATARS.map((item) => {
                        const isSelected = formData.avatarUrl === item.url;
                        return (
                          <div
                            key={item.id}
                            className={`avatar-slide-chip ${isSelected ? "selected" : ""}`}
                            onClick={() => handleAvatarSelect(item.url)}
                            title={item.name}
                          >
                            <div className="avatar-slide-img-wrap">
                              <img
                                src={item.url}
                                alt={item.name}
                                className="avatar-slide-img"
                              />
                              {isSelected && (
                                <div className="selected-check-badge">
                                  <FaCheck />
                                </div>
                              )}
                            </div>
                            <span className="avatar-slide-name">{item.name}</span>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      className="avatar-slide-btn right"
                      onClick={() => scrollSlider("right")}
                      aria-label="Scroll right"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>

                {/* Account Form Fields */}
                <div className="profile-form-grid">
                  <div className="profile-form-group">
                    <label>
                      <FaUser style={{ marginRight: "6px" }} /> Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="profile-input"
                      required
                    />
                  </div>

                  <div className="profile-form-group">
                    <label>
                      <FaEnvelope style={{ marginRight: "6px" }} /> Email Address (Read-only)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      className="profile-input"
                      disabled
                    />
                  </div>

                  <div className="profile-form-group">
                    <label>
                      <FaPhone style={{ marginRight: "6px" }} /> Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="profile-input"
                    />
                  </div>

                  <div className="profile-form-group">
                    <label>
                      <FaKey style={{ marginRight: "6px" }} /> New Password (Optional)
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Leave blank to keep unchanged"
                      className="profile-input"
                    />
                  </div>

                  <div className="profile-form-group full-width">
                    <label>
                      <FaMapMarkerAlt style={{ marginRight: "6px" }} /> Default Delivery Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Flat / House No, Street, Landmark, City, Pincode"
                      rows="3"
                      className="profile-input"
                    ></textarea>
                  </div>
                </div>

                <div className="profile-actions">
                  <button
                    type="submit"
                    className="brand-btn"
                    disabled={loading}
                    style={{ padding: "12px 28px", display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <FaSave /> {loading ? "Saving Changes..." : "Save Profile Details"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: MY ORDERS & LIVE STAGE TRACKING */}
        {activeTab === "orders" && (
          <div style={{ marginTop: "-20px" }}>
            <MyOrders />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
