import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import { getCartoonAvatar, MALE_AVATARS, FEMALE_AVATARS } from "../utils/avatar";
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
  FaMars,
  FaVenus,
  FaSmile,
} from "react-icons/fa";
import "./UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read initial tab from URL query param ?tab=orders
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") === "orders" ? "orders" : "info";

  const [activeTab, setActiveTab] = useState(initialTab);

  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

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

  const handleGenderChange = (selectedGender) => {
    const defaultAvatar = selectedGender === "female" 
      ? `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(formData.name || "girl")}`
      : `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(formData.name || "boy")}`;

    setFormData((prev) => ({
      ...prev,
      gender: selectedGender,
      avatarUrl: defaultAvatar,
    }));
  };

  const handleAvatarSelect = (url) => {
    setFormData((prev) => ({ ...prev, avatarUrl: url }));
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
        toast.success("Profile & Cool Cartoon Avatar updated!");
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
  const avatarPresets = formData.gender === "female" ? FEMALE_AVATARS : MALE_AVATARS;

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar-wrapper">
            <img
              src={currentAvatar}
              alt="User Cartoon Avatar"
              className="profile-avatar-cartoon"
            />
            <div className="profile-title-group">
              <h2>{formData.name || "My Account"}</h2>
              <p>{formData.email}</p>
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
            <FaUser /> Account & Cool Cartoon Avatar
          </button>
          <button
            className={`profile-tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <FaBox /> My Orders & Live Stage Tracking
          </button>
        </div>

        {/* TAB 1: ACCOUNT DETAILS & CARTOON AVATAR */}
        {activeTab === "info" && (
          <div>
            {fetching ? (
              <p style={{ textAlign: "center", color: "#A0A0A0" }}>Loading account profile...</p>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Gender & Cartoon Avatar Selector */}
                <div className="avatar-picker-section">
                  <div className="avatar-picker-title">
                    <FaSmile style={{ color: "var(--brand-orange)", marginRight: "6px" }} /> Choose Avatar Style & Gender
                  </div>

                  <div className="gender-toggle-group">
                    <button
                      type="button"
                      className={`gender-btn ${formData.gender === "male" ? "active" : ""}`}
                      onClick={() => handleGenderChange("male")}
                    >
                      <FaMars /> Male (Boy Cartoon)
                    </button>
                    <button
                      type="button"
                      className={`gender-btn ${formData.gender === "female" ? "active" : ""}`}
                      onClick={() => handleGenderChange("female")}
                    >
                      <FaVenus /> Female (Girl Cartoon)
                    </button>
                  </div>

                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "8px" }}>
                    Select a cool cartoon style:
                  </div>

                  <div className="avatar-grid">
                    {avatarPresets.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Preset ${i}`}
                        className={`avatar-option ${formData.avatarUrl === url ? "selected" : ""}`}
                        onClick={() => handleAvatarSelect(url)}
                      />
                    ))}
                  </div>
                </div>

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
