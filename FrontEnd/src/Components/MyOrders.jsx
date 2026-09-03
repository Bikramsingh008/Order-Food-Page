import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../utils/api";
import {
  FaBox,
  FaUtensils,
  FaCheckCircle,
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaHeart,
  FaChevronDown,
  FaChevronUp,
  FaHistory,
  FaFire,
  FaShoppingBag,
} from "react-icons/fa";
import "./MyOrders.css";

import cookingImg from "../assets/delivery/cooking.jpg";
import scooterImg from "../assets/delivery/scooter.jpg";
import doorstepImg from "../assets/delivery/doorstep.jpg";

const FALLBACK_FOOD_IMG =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";

const getItemImage = (item) => {
  if (!item) return FALLBACK_FOOD_IMG;
  // If array of images
  if (Array.isArray(item.img) && item.img.length > 0 && typeof item.img[0] === "string" && item.img[0].length > 5) {
    return item.img[0];
  }
  // If single string URL
  if (typeof item.img === "string" && item.img.length > 5) {
    return item.img;
  }
  if (Array.isArray(item.image) && item.image.length > 0 && typeof item.image[0] === "string" && item.image[0].length > 5) {
    return item.image[0];
  }
  if (typeof item.image === "string" && item.image.length > 5) {
    return item.image;
  }
  if (typeof item.imageUrl === "string" && item.imageUrl.length > 5) {
    return item.imageUrl;
  }
  return FALLBACK_FOOD_IMG;
};

const STAGES_CONFIG = [
  {
    key: "Order Placed",
    label: "Order Placed",
    title: "📋 Order Received & Confirmed",
    subtitle: "Your order has been received by the kitchen! Getting ready...",
    img: null,
    badge: "Stage 1/6 • Kitchen Confirmed",
  },
  {
    key: "Cooking Fresh",
    label: "Cooking Fresh",
    title: "👨‍🍳 Cooking Fresh in Kitchen",
    subtitle: "Our master chef is preparing & cooking your food fresh with love!",
    img: cookingImg,
    badge: "Stage 2/6 • Fresh Preparation",
  },
  {
    key: "Order Packed",
    label: "Order Packed",
    title: "📦 Order Packed & Sealed",
    subtitle: "Your hot meal has been packaged hygienically & ready for dispatch.",
    img: null,
    badge: "Stage 3/6 • Sealed Hot",
  },
  {
    key: "Out for Delivery",
    label: "Out for Delivery",
    title: "🛵 Delivery Partner On The Way",
    subtitle: "The delivery boy has picked up your order and is riding fast to your location!",
    img: scooterImg,
    badge: "Stage 4/6 • Live Transit",
  },
  {
    key: "Arrived at Doorstep",
    label: "At Doorstep",
    title: "🚪 Delivery Boy Reached Your Address!",
    subtitle: "The delivery rider has arrived on time and is waiting for you at your doorstep!",
    img: doorstepImg,
    badge: "Stage 5/6 • Arrived at Doorstep",
  },
  {
    key: "Delivered",
    label: "Delivered",
    title: "🎉 Food Delivered Successfully!",
    subtitle: "Your meal has been delivered hot & fresh! Thank you for ordering with YummyFood!",
    img: doorstepImg,
    badge: "Stage 6/6 • Order Completed",
  },
];

const getStageIndex = (status) => {
  if (status === "Delivered") return 5;
  if (status === "Arrived at Doorstep") return 4;
  if (status === "Out for Delivery" || status === "Delivery Boy On The Way") return 3;
  if (status === "Order Packed" || status === "Packing") return 2;
  if (status === "Cooking Fresh" || status === "Cooking") return 1;
  return 0; // Order Placed / Food Processing
};

// Compute deterministic live stage from order creation timestamp
const computeStageFromDate = (order) => {
  if (order.status === "Delivered" || order.status === "Cancelled") {
    return order.status;
  }
  const orderTime = new Date(order.date || order.createdAt).getTime();
  const elapsedSec = Math.floor((Date.now() - orderTime) / 1000);

  if (elapsedSec >= 50) return "Delivered";
  if (elapsedSec >= 40) return "Arrived at Doorstep";
  if (elapsedSec >= 30) return "Out for Delivery";
  if (elapsedSec >= 20) return "Order Packed";
  if (elapsedSec >= 10) return "Cooking Fresh";
  return "Order Placed";
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Expandable toggle state for past orders: { [orderId]: boolean }
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  // ─── DETERMINISTIC LIVE STATUS TICKER (STOPS AT DELIVERED, NEVER RESTARTS) ───
  useEffect(() => {
    if (!token) return;

    const timer = setInterval(() => {
      setOrders((prevOrders) => {
        let anyChanged = false;
        const nextOrders = prevOrders.map((o) => {
          // Once delivered or cancelled, NEVER change or restart
          if (o.status === "Delivered" || o.status === "Cancelled") return o;

          const targetStatus = computeStageFromDate(o);
          if (targetStatus !== o.status) {
            anyChanged = true;

            // Sync to MongoDB via authorized user endpoint
            axios
              .post(
                `${API_URL}/order/update-status`,
                { orderId: o._id, status: targetStatus },
                { headers: { Authorization: `Bearer ${token}` } }
              )
              .catch((err) => console.log("Status sync err:", err));

            return { ...o, status: targetStatus };
          }
          return o;
        });

        return anyChanged ? nextOrders : prevOrders;
      });
    }, 2000); // Check every 2s

    return () => clearInterval(timer);
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
        toast.success("Thank you for your rating & feedback! ⭐ Feedback sent to Kitchen Admin.");
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

  // Split into Active (in-progress or recently delivered so user sees Step 6 & feedback) and Past
  const now = Date.now();
  const activeOrders = orders.filter((o) => {
    if (o.status === "Cancelled") return false;
    if (o.status !== "Delivered") return true;
    const orderTime = new Date(o.date || o.createdAt).getTime();
    // Keep visible in live tracker view so user clearly sees Step 6 Delivered and can rate it!
    return (now - orderTime) < 15 * 60 * 1000;
  });

  const pastOrders = orders.filter(
    (o) => o.status === "Delivered" || o.status === "Cancelled"
  );

  return (
    <div className="myorders-container">
      <div className="myorders-header">
        <h2>📦 Your Food Orders & Live Stage Tracking</h2>
        <p>
          Active orders auto-advance through 6 live stages every 10 seconds. Once delivered, it terminates permanently!
        </p>
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
        <>
          {/* ─── SECTION 1: ACTIVE LIVE ORDERS ──────────────────────────────── */}
          {activeOrders.length > 0 && (
            <div className="active-orders-section">
              <div className="section-title-badge">
                <FaFire style={{ color: "var(--brand-orange)" }} /> Active Orders in Progress ({activeOrders.length})
              </div>

              {activeOrders.map((order) => {
                const activeIndex = getStageIndex(order.status);
                const stageInfo = STAGES_CONFIG[activeIndex] || STAGES_CONFIG[0];
                const progressPercent = (activeIndex / (STAGES_CONFIG.length - 1)) * 100;
                const isDelivered = order.status === "Delivered";

                return (
                  <div key={order._id} className="order-card active-live-card">
                    {/* Top info bar */}
                    <div className="order-top-bar">
                      <div className="order-id-group">
                        <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                        <span className="order-date">
                          <FaClock style={{ marginRight: "4px" }} />
                          {new Date(order.date || order.createdAt).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className={`order-status-badge ${isDelivered ? "status-delivered" : "status-transit"}`}>
                        {isDelivered ? "✅ Delivered" : `⚡ ${order.status}`}
                      </div>
                    </div>

                    {/* LIVE STAGE TRACKER & ILLUSTRATION DISPLAY */}
                    <div className="tracker-box">
                      <div className="live-stage-banner">
                        {stageInfo.img ? (
                          <div className="live-stage-img-wrap">
                            <img
                              src={stageInfo.img}
                              alt={stageInfo.title}
                              className="live-stage-illustration"
                            />
                          </div>
                        ) : (
                          <div className="live-stage-icon-fallback">
                            <FaUtensils style={{ fontSize: "2.5rem", color: "var(--brand-orange)" }} />
                          </div>
                        )}

                        <div className="live-stage-text">
                          <span className="live-stage-badge">{stageInfo.badge}</span>
                          <h3 className="live-stage-title">{stageInfo.title}</h3>
                          <p className="live-stage-subtitle">{stageInfo.subtitle}</p>
                        </div>
                      </div>

                      {/* Horizontal Step Progress Bar (All 6 Steps) */}
                      <div className="tracker-steps">
                        <div className="tracker-line-bg"></div>
                        <div
                          className="tracker-line-progress"
                          style={{ width: `${progressPercent}%` }}
                        ></div>

                        {STAGES_CONFIG.map((stage, idx) => {
                          const isCompleted = idx < activeIndex || (isDelivered && idx === activeIndex);
                          const isActive = idx === activeIndex && !isDelivered;

                          return (
                            <div
                              key={stage.key}
                              className={`tracker-step ${
                                isCompleted ? "completed" : isActive ? "active" : ""
                              }`}
                            >
                              <div className="step-icon-circle">
                                {isCompleted ? <FaCheckCircle /> : idx + 1}
                              </div>
                              <span className="step-label">{stage.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="order-items-list">
                      {order.items.map((item, i) => (
                        <div key={i} className="order-item-row">
                          <img
                            src={getItemImage(item)}
                            alt={item.title || "Dish"}
                            className="order-item-img"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = FALLBACK_FOOD_IMG;
                            }}
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
                        {isDelivered ? "Delivered to: " : "Delivering to: "}
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

                    {/* IF DELIVERED: SHOW RATING & FEEDBACK SECTION RIGHT ON THE CARD */}
                    {isDelivered && (
                      <div className="rating-section" style={{ marginTop: "20px" }}>
                        <div className="rating-title">
                          <FaHeart style={{ color: "#EF4444" }} /> Food Delivered! Rate Your Experience
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
                              ✓ Feedback Visible in Admin Panel
                            </span>
                          </div>
                        ) : (
                          <div>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "10px" }}>
                              Rate this order's food taste & delivery speed:
                            </p>
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
                              placeholder="Write a review message for the chef & delivery partner (optional)..."
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
                              style={{ padding: "10px 24px", fontSize: "0.88rem" }}
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
              })}
            </div>
          )}

          {/* ─── SECTION 2: PAST ORDERS HISTORY (BRIEF + CLICK TO EXPAND) ───── */}
          <div className="past-orders-section">
            <div className="section-title-badge">
              <FaHistory style={{ color: "var(--brand-orange)" }} /> Past Orders History ({pastOrders.length})
            </div>
            <p className="past-orders-subtext">
              Brief summary shown below. Tap on any past order to expand complete details and leave a review.
            </p>

            {pastOrders.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontStyle: "italic", padding: "16px 0" }}>
                No completed past orders yet.
              </p>
            ) : (
              pastOrders.map((order) => {
                const isExpanded = expandedOrders[order._id] || false;
                const itemsSummary = order.items
                  ? `${order.items.length} item${order.items.length > 1 ? "s" : ""} (${order.items.map((it) => it.title).slice(0, 2).join(", ")}${order.items.length > 2 ? "..." : ""})`
                  : "Order items";

                return (
                  <div key={order._id} className="past-order-brief-card">
                    {/* Compact Brief Bar (Always Visible & Clickable) */}
                    <div
                      className="past-order-header-row"
                      onClick={() => toggleOrderDetails(order._id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="past-order-id-block">
                        <span className="past-order-id">#{order._id.slice(-8).toUpperCase()}</span>
                        <span className="past-order-date">
                          {new Date(order.date || order.createdAt).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="past-order-items-snippet">
                        <FaShoppingBag style={{ color: "var(--brand-orange)", marginRight: "6px" }} />
                        <span>{itemsSummary}</span>
                      </div>

                      <div className="past-order-right-meta">
                        <span className="past-order-amount">₹{order.amount}</span>
                        <span className="order-status-badge status-delivered">
                          ✅ Delivered
                        </span>

                        {order.rating > 0 ? (
                          <span className="past-order-rating-pill">
                            ⭐ {order.rating}/5
                          </span>
                        ) : (
                          <span className="past-order-rate-prompt">
                            ⭐ Rate Meal
                          </span>
                        )}

                        <button
                          type="button"
                          className="expand-toggle-btn"
                          aria-label="Toggle details"
                        >
                          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Full Details Section */}
                    {isExpanded && (
                      <div className="past-order-expanded-body">
                        {/* Items List */}
                        <div className="order-items-list">
                          {order.items.map((item, i) => (
                            <div key={i} className="order-item-row">
                              <img
                                src={getItemImage(item)}
                                alt={item.title || "Dish"}
                                className="order-item-img"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = FALLBACK_FOOD_IMG;
                                }}
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
                            Delivered to:{" "}
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

                        {/* THANK YOU & RATING / FEEDBACK REVIEW SECTION */}
                        <div className="rating-section">
                          <div className="rating-title">
                            <FaHeart style={{ color: "#EF4444" }} /> Food & Delivery Experience Feedback
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
                                ✓ Feedback Visible in Admin Panel
                              </span>
                            </div>
                          ) : (
                            <div>
                              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "10px" }}>
                                Rate this order's food taste & delivery speed:
                              </p>
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
                                placeholder="Write a review message for the chef & delivery partner (optional)..."
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
                                style={{ padding: "10px 24px", fontSize: "0.88rem" }}
                                disabled={submittingRating[order._id]}
                                onClick={() => handleRatingSubmit(order._id)}
                              >
                                {submittingRating[order._id] ? "Submitting..." : "Submit Rating & Review"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyOrders;
