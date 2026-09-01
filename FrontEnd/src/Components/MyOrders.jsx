import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../utils/api";
import {
  FaBox,
  FaUtensils,
  FaMotorcycle,
  FaCheckCircle,
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaReceipt,
} from "react-icons/fa";
import "./MyOrders.css";

const STAGES = [
  { key: "Order Placed", label: "Order Received", icon: <FaReceipt /> },
  { key: "Order Packed", label: "Packed & Prepared", icon: <FaUtensils /> },
  { key: "Delivery Boy On The Way", label: "Rider Assigned", icon: <FaMotorcycle /> },
  { key: "Out for Delivery", label: "Out for Delivery", icon: <FaBox /> },
  { key: "Delivered", label: "Delivered", icon: <FaCheckCircle /> },
];

const getStageIndex = (status) => {
  if (status === "Delivered") return 4;
  if (status === "Out for Delivery") return 3;
  if (status === "Delivery Boy On The Way") return 2;
  if (status === "Order Packed" || status === "Preparing") return 1;
  if (status === "Order Placed") return 0;
  return 0;
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Rating state per order
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [submittingRating, setSubmittingRating] = useState({});

  const fetchOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/order/userorders`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        toast.error(res.data.message || "Could not load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleRatingSubmit = async (orderId) => {
    const starCount = ratings[orderId] || 0;
    const reviewText = reviews[orderId] || "";

    if (starCount === 0) {
      toast.warning("Please select at least 1 star to submit your rating.");
      return;
    }

    try {
      setSubmittingRating((prev) => ({ ...prev, [orderId]: true }));
      const res = await axios.post(
        `${API_URL}/order/rate`,
        { orderId, rating: starCount, review: reviewText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Thank you for your rating & feedback! ⭐");
        fetchOrders();
      } else {
        toast.error(res.data.message || "Failed to submit rating");
      }
    } catch (error) {
      console.error("Rating error:", error);
      toast.error("Error submitting rating");
    } finally {
      setSubmittingRating((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <div className="myorders-container">
      <div className="myorders-header">
        <h2>📦 Your Orders & Live Tracking</h2>
        <p>Track your food order stages in real time and rate your meal after delivery</p>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "#AAA" }}>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            padding: "48px",
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "3rem" }}>🍔</span>
          <h3 style={{ marginTop: "16px", color: "#FFF" }}>No orders placed yet!</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
            Explore our delicious menu and place your first food order now.
          </p>
          <a href="/ourfood" className="brand-btn" style={{ padding: "12px 28px" }}>
            Explore Menu
          </a>
        </div>
      ) : (
        orders.map((order) => {
          const activeIndex = getStageIndex(order.status);
          const isCancelled = order.status === "Cancelled";
          const isDelivered = order.status === "Delivered";
          const progressPercent = (activeIndex / (STAGES.length - 1)) * 100;

          return (
            <div key={order._id} className="order-card">
              {/* Top info bar */}
              <div className="order-top-bar">
                <div className="order-id-group">
                  <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                  <span className="order-date">
                    <FaClock style={{ marginRight: "4px" }} />
                    {new Date(order.date || order.createdAt).toLocaleString()}
                  </span>
                </div>

                <div
                  className={`order-status-badge ${
                    isDelivered
                      ? "status-delivered"
                      : isCancelled
                      ? "status-cancelled"
                      : order.status === "Out for Delivery" || order.status === "Delivery Boy On The Way"
                      ? "status-transit"
                      : order.status === "Order Packed"
                      ? "status-packed"
                      : "status-placed"
                  }`}
                >
                  {isDelivered ? "✅ Delivered" : isCancelled ? "❌ Cancelled" : `🚀 ${order.status}`}
                </div>
              </div>

              {/* LIVE STAGE TRACKER */}
              {!isCancelled && (
                <div className="tracker-box">
                  <div className="tracker-title">
                    <span>Live Order Progress Stage</span>
                    <span style={{ color: "var(--brand-orange)", textTransform: "none" }}>
                      Status: {order.status}
                    </span>
                  </div>

                  <div className="tracker-steps">
                    <div className="tracker-line-bg"></div>
                    <div
                      className="tracker-line-progress"
                      style={{ width: `${progressPercent}%` }}
                    ></div>

                    {STAGES.map((stage, idx) => {
                      const isCompleted = idx < activeIndex;
                      const isActive = idx === activeIndex;

                      return (
                        <div
                          key={stage.key}
                          className={`tracker-step ${
                            isCompleted ? "completed" : isActive ? "active" : ""
                          }`}
                        >
                          <div className="step-icon-circle">
                            {isCompleted ? <FaCheckCircle /> : stage.icon}
                          </div>
                          <span className="step-label">{stage.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="order-items-list">
                {order.items.map((item, i) => (
                  <div key={i} className="order-item-row">
                    <img
                      src={
                        item.img && item.img[0]
                          ? item.img[0]
                          : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80"
                      }
                      alt={item.title}
                      className="order-item-img"
                    />
                    <div className="order-item-info">
                      <div className="order-item-name">
                        {item.title} x {item.quantity}
                      </div>
                      {item.customizationSummary && (
                        <div className="order-item-customization">
                          👉 {item.customizationSummary}
                        </div>
                      )}
                    </div>
                    <div className="order-item-price">
                      ₹{(item.itemPrice || item.price) * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address & Summary */}
              <div className="order-bottom-summary">
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  <FaMapMarkerAlt style={{ color: "var(--brand-orange)", marginRight: "4px" }} />
                  Delivering to:{" "}
                  <strong style={{ color: "#FFF" }}>
                    {order.address?.street
                      ? `${order.address.street}, ${order.address.city}`
                      : "Saved Delivery Address"}
                  </strong>
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                  Total Paid: <span style={{ color: "var(--brand-orange)" }}>₹{order.amount}</span>{" "}
                  <span style={{ fontSize: "0.75rem", color: "#888" }}>({order.paymentMethod})</span>
                </div>
              </div>

              {/* POST-DELIVERY RATING SECTION */}
              {isDelivered && (
                <div className="rating-section">
                  <div className="rating-title">
                    <FaStar /> Rate Your Food & Delivery Experience
                  </div>

                  {order.rating > 0 ? (
                    <div className="rating-saved-box">
                      <div>
                        <div style={{ color: "#FFC107", fontSize: "1.2rem", fontWeight: 700 }}>
                          {"★".repeat(order.rating)}{"☆".repeat(5 - order.rating)} ({order.rating}/5 Stars)
                        </div>
                        {order.review && (
                          <div style={{ color: "#E0E0E0", fontSize: "0.9rem", marginTop: "4px" }}>
                            "{order.review}"
                          </div>
                        )}
                      </div>
                      <span style={{ color: "#4ADE80", fontWeight: 700, fontSize: "0.85rem" }}>
                        ✓ Feedback Saved
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="stars-picker">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`star-btn ${
                              (ratings[order._id] || 0) >= star ? "active" : ""
                            }`}
                            onClick={() =>
                              setRatings((prev) => ({ ...prev, [order._id]: star }))
                            }
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <textarea
                        placeholder="Write a quick review about the food taste, packaging & delivery speed..."
                        rows="2"
                        className="rating-textarea"
                        value={reviews[order._id] || ""}
                        onChange={(e) =>
                          setReviews((prev) => ({ ...prev, [order._id]: e.target.value }))
                        }
                      ></textarea>
                      <button
                        type="button"
                        className="brand-btn"
                        style={{ padding: "8px 20px", fontSize: "0.85rem" }}
                        disabled={submittingRating[order._id]}
                        onClick={() => handleRatingSubmit(order._id)}
                      >
                        {submittingRating[order._id] ? "Submitting..." : "Submit Rating & Review"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyOrders;
