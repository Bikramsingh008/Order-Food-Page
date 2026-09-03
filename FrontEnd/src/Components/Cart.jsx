import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaTag,
  FaMotorcycle,
  FaCheckCircle,
  FaTimes,
  FaArrowRight,
  FaUtensils,
  FaCopy,
  FaShieldAlt,
} from "react-icons/fa";
import { API_URL } from "../utils/api";
import "./Cart.css";

const PROMO_CODES = [
  { code: "YUMMY50", discount: 50, minOrder: 299, desc: "Flat ₹50 OFF on orders > ₹299" },
  { code: "FEAST10", percent: 10, maxDiscount: 100, minOrder: 399, desc: "10% OFF up to ₹100" },
  { code: "FREESHIP", freeDelivery: true, minOrder: 199, desc: "Free Delivery on orders > ₹199" },
];

const Cart = ({ cartItems, updateQuantity, removeFromCart, clearCart, handleCart }) => {
  const navigate = useNavigate();

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  // Recommendations state for empty cart / upsell
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  // Promo Code State
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Rider Tip State
  const [riderTip, setRiderTip] = useState(0);

  // Cooking notes / special request state
  const [orderNotes, setOrderNotes] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Delivery form state — autofilled from user profile if available
  const [formData, setFormData] = useState({
    firstName: user?.name ? user.name.split(" ")[0] || "" : "",
    lastName: user?.name ? user.name.split(" ").slice(1).join(" ") || "" : "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipcode: user?.address?.zipcode || "",
    paymentMethod: "COD",
  });

  // Fetch top recommendations for empty cart and upsell
  useEffect(() => {
    const fetchRecs = async () => {
      try {
        setLoadingRecs(true);
        const res = await axios.get(`${API_URL}/product/list`);
        if (res.data.success && Array.isArray(res.data.products)) {
          // Pick top 4 products
          setRecommendations(res.data.products.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to load recommendations:", err);
      } finally {
        setLoadingRecs(false);
      }
    };
    fetchRecs();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calculate cart subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.itemPrice || item.price) * item.quantity,
    0
  );

  // Calculate delivery fee
  let baseDeliveryFee = subtotal > 0 ? (subtotal >= 499 ? 0 : 40) : 0;
  if (appliedPromo?.freeDelivery && subtotal >= (appliedPromo.minOrder || 0)) {
    baseDeliveryFee = 0;
  }
  const deliveryFee = baseDeliveryFee;

  // Calculate promo discount
  let promoDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.discount) {
      promoDiscount = appliedPromo.discount;
    } else if (appliedPromo.percent) {
      const calculated = (subtotal * appliedPromo.percent) / 100;
      promoDiscount = Math.min(calculated, appliedPromo.maxDiscount || calculated);
    }
  }

  // Restaurant packaging fee
  const packagingFee = subtotal > 0 ? 15 : 0;

  // Grand Total calculation
  const grandTotal = Math.max(
    0,
    subtotal + deliveryFee + packagingFee + riderTip - promoDiscount
  );

  // Free delivery threshold progress (Target ₹500)
  const freeDeliveryThreshold = 500;
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  // Apply Promo Code
  const handleApplyPromo = (promoToApply) => {
    const promo = promoToApply || PROMO_CODES.find(
      (p) => p.code.toLowerCase() === promoInput.trim().toLowerCase()
    );

    if (!promo) {
      toast.error("Invalid coupon code. Try YUMMY50 or FEAST10!");
      return;
    }

    if (subtotal < promo.minOrder) {
      toast.warning(`Minimum order amount of ₹${promo.minOrder} required for ${promo.code}`);
      return;
    }

    setAppliedPromo(promo);
    setPromoInput(promo.code);
    toast.success(`🎉 Coupon "${promo.code}" applied successfully!`);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    toast.info("Coupon removed.");
  };

  const handleProceedToCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please sign in to place your order.");
      sessionStorage.setItem("redirectUrl", "/cart");
      navigate("/signin");
      return;
    }
    if (cartItems.length === 0) {
      toast.warn("Your cart is empty.");
      return;
    }
    setShowCheckoutModal(true);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.street || !formData.city) {
      toast.error("Please enter complete delivery address and phone number.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication expired. Please log in again.");
      navigate("/signin");
      return;
    }

    try {
      setSubmitting(true);

      // Prepare order items payload
      const orderItems = cartItems.map((item) => {
        let customizationText = "";
        if (item.customizationSummary) {
          customizationText = item.customizationSummary;
        } else if (item.customizations && Array.isArray(item.customizations)) {
          const removed = item.customizations
            .filter((c) => c.status === "removed")
            .map((c) => `${c.name} ✗`);
          const extras = item.customizations
            .filter((c) => c.status === "extra")
            .map((c) => c.change);
          customizationText = [...removed, ...extras].join(", ");
        }

        return {
          productId: item.productId || item.id || item._id,
          title: item.title,
          basePrice: item.basePrice || item.price,
          itemPrice: item.itemPrice || item.price,
          quantity: item.quantity,
          img: Array.isArray(item.img) ? item.img : item.img ? [item.img] : ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c"],
          customizations: item.customizations || [],
          customizationSummary: customizationText
            ? `${item.title} x${item.quantity} — ${customizationText}`
            : `${item.title} x${item.quantity}`,
        };
      });

      const orderPayload = {
        items: orderItems,
        amount: Math.round(grandTotal),
        address: {
          ...formData,
          orderNotes: orderNotes.trim() || undefined,
        },
        paymentMethod: formData.paymentMethod,
        riderTip,
        promoCode: appliedPromo?.code || null,
        discount: promoDiscount,
      };

      const res = await axios.post(`${API_URL}/order/place`, orderPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("🎉 Order placed successfully!");
        const orderId = res.data.orderId || res.data.order?._id || res.data.order?.id;

        // ── Save order placement timestamp so stage calculator can anchor from NOW ──
        if (orderId) {
          localStorage.setItem(`order_start_${orderId}`, Date.now());
        }

        setPlacedOrderDetails({
          orderId: orderId || "YM-" + Math.floor(100000 + Math.random() * 900000),
          total: Math.round(grandTotal),
          address: formData,
          items: orderItems,
          paymentMethod: formData.paymentMethod,
        });
        if (typeof clearCart === "function") clearCart();
        setShowCheckoutModal(false);
      } else {
        toast.error(res.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.response?.data?.message || "Error placing order");
    } finally {
      setSubmitting(false);
    }
  };

  // Copy order ID helper
  const copyOrderId = (id) => {
    navigator.clipboard.writeText(id);
    toast.success("Order ID copied to clipboard! 📋");
  };

  // If order was successfully placed, display high-end confirmation receipt view
  if (placedOrderDetails) {
    return (
      <div className="cart-container">
        <div className="order-success-card">
          <div className="success-confetti-badge">🎉</div>
          <h2 className="success-heading">Order Confirmed!</h2>
          <p className="success-subheading">
            Your kitchen slip has been dispatched to chef. Get ready for a feast!
          </p>

          <div className="order-id-chip-row">
            <span className="order-id-label">Order Reference ID:</span>
            <span className="order-id-pill">#{placedOrderDetails.orderId}</span>
            <button
              type="button"
              className="copy-id-btn"
              onClick={() => copyOrderId(placedOrderDetails.orderId)}
              title="Copy Order ID"
            >
              <FaCopy /> Copy
            </button>
          </div>

          <div className="success-summary-box">
            <div className="summary-section-title">
              <FaMotorcycle style={{ color: "var(--brand-orange)" }} /> Delivery Destination:
            </div>
            <p className="summary-dest-text">
              <b>
                {placedOrderDetails.address.firstName} {placedOrderDetails.address.lastName}
              </b>{" "}
              (📞 {placedOrderDetails.address.phone})
            </p>
            <p className="summary-dest-address">
              📍 {placedOrderDetails.address.street}, {placedOrderDetails.address.city},{" "}
              {placedOrderDetails.address.state} - {placedOrderDetails.address.zipcode}
            </p>

            <div className="summary-section-title" style={{ marginTop: "20px" }}>
              <FaUtensils style={{ color: "var(--brand-orange)" }} /> Dishes Being Cooked:
            </div>
            <ul className="success-item-list">
              {placedOrderDetails.items.map((it, idx) => (
                <li key={idx} className="success-item-row">
                  <div>
                    <span className="success-item-title">{it.title}</span>
                    <span className="success-item-qty"> x{it.quantity}</span>
                    {it.customizationSummary && (
                      <div className="success-cust-summary">👉 {it.customizationSummary}</div>
                    )}
                  </div>
                  <span className="success-item-amount">₹{it.itemPrice * it.quantity}</span>
                </li>
              ))}
            </ul>

            <div className="success-total-row">
              <span>Total Amount ({placedOrderDetails.paymentMethod}):</span>
              <span className="success-final-price">₹{placedOrderDetails.total}</span>
            </div>
          </div>

          <div className="success-actions-row">
            <button
              className="brand-btn success-track-btn"
              onClick={() => navigate("/myorders")}
            >
              Track Live Order 🛵
            </button>
            <button
              className="success-continue-btn"
              onClick={() => {
                setPlacedOrderDetails(null);
                navigate("/ourfood");
              }}
            >
              Order More Food →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      {/* Page Header */}
      <div className="cart-header">
        <div className="cart-header-title-row">
          <div className="cart-header-badge">
            <FaShoppingCart /> My Cart
          </div>
          {cartItems.length > 0 && (
            <button
              className="clear-cart-text-btn"
              onClick={() => {
                if (window.confirm("Are you sure you want to remove all items from your cart?")) {
                  clearCart();
                  toast.info("Cart cleared");
                }
              }}
            >
              <FaTrash size={12} /> Clear Entire Cart
            </button>
          )}
        </div>
        <h1 className="cart-main-title">Delicious Order Bag</h1>
        <p className="cart-subtitle">
          {cartItems.length === 0
            ? "Your cart is feeling light and hungry. Treat yourself to something delicious!"
            : `You have ${cartItems.reduce((acc, it) => acc + it.quantity, 0)} item${
                cartItems.reduce((acc, it) => acc + it.quantity, 0) > 1 ? "s" : ""
              } selected. Customize, review bill, and checkout.`}
        </p>
      </div>

      {/* Free Delivery Meter (When items present) */}
      {cartItems.length > 0 && (
        <div className="free-delivery-card">
          <div className="delivery-meter-info">
            <div className="meter-left">
              <span className="meter-icon">🚚</span>
              {subtotal >= freeDeliveryThreshold ? (
                <span className="meter-text success">
                  <b>Awesome!</b> You've unlocked <b>FREE Express Delivery!</b>
                </span>
              ) : (
                <span className="meter-text">
                  Add items worth <b>₹{amountNeededForFreeDelivery.toFixed(0)}</b> more to unlock{" "}
                  <b style={{ color: "var(--brand-orange)" }}>FREE Delivery</b>!
                </span>
              )}
            </div>
            <span className="meter-threshold">Goal: ₹500</span>
          </div>
          <div className="delivery-progress-track">
            <div
              className={`delivery-progress-fill ${
                subtotal >= freeDeliveryThreshold ? "complete" : ""
              }`}
              style={{ width: `${freeDeliveryProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* EMPTY CART STATE */}
      {cartItems.length === 0 ? (
        <div className="empty-cart-state-wrapper">
          <div className="empty-cart-view">
            <div className="empty-cart-icon-halo">
              <div className="empty-cart-emoji">🍽️</div>
            </div>
            <h2 className="empty-cart-title">Your Cart is Currently Empty!</h2>
            <p className="empty-cart-text">
              Hot, freshly prepared meals are waiting in our kitchen. Explore our menu, choose your
              favorite toppings, and satisfy your cravings in minutes.
            </p>

            <Link to="/ourfood" className="brand-btn browse-menu-btn">
              Explore Full Menu <FaArrowRight />
            </Link>
          </div>

          {/* Quick Add Recommendations Section */}
          {recommendations.length > 0 && (
            <div className="cart-recommendations-section">
              <div className="recs-header">
                <h3>⚡ Popular Favorites to Quick-Add</h3>
                <p>Loved by foodies — add directly to your bag with one tap</p>
              </div>

              <div className="recs-grid">
                {recommendations.map((dish) => (
                  <div key={dish._id} className="rec-card">
                    <div className="rec-img-wrapper">
                      <img
                        src={
                          dish.img?.[0] ||
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                        }
                        alt={dish.title}
                        className="rec-img"
                      />
                      <span className={`rec-type-pill ${dish.type}`}>
                        {dish.type === "veg" ? "🌱 Veg" : "🍖 Non-Veg"}
                      </span>
                    </div>

                    <div className="rec-details">
                      <h4 className="rec-title">{dish.title}</h4>
                      <p className="rec-desc">
                        {dish.description
                          ? dish.description.length > 55
                            ? dish.description.substring(0, 55) + "..."
                            : dish.description
                          : "Delicious recipe freshly cooked."}
                      </p>

                      <div className="rec-footer">
                        <span className="rec-price">₹{Number(dish.price).toFixed(2)}</span>
                        <button
                          className="rec-quick-add-btn"
                          onClick={() => {
                            if (typeof handleCart === "function") {
                              handleCart({
                                id: dish._id,
                                productId: dish._id,
                                title: dish.title,
                                price: Number(dish.price),
                                itemPrice: Number(dish.price),
                                quantity: 1,
                                img: dish.img?.[0],
                                customizations: [],
                              });
                              toast.success(`Added ${dish.title} to cart! 😋`);
                            } else {
                              navigate(`/food/${dish._id}`);
                            }
                          }}
                        >
                          <FaPlus size={10} /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* CART CONTENT WITH ITEMS */
        <div className="cart-content-layout">
          {/* Left / Main Items Column */}
          <div className="cart-items-section">
            <div className="items-list-header">
              <h3>Dishes in Your Order ({cartItems.length})</h3>
              <Link to="/ourfood" className="add-more-link">
                + Add More Dishes
              </Link>
            </div>

            {cartItems.map((item, index) => (
              <div key={item.cartItemId || index} className="cart-item-card">
                <div className="cart-item-img-wrapper">
                  <img
                    src={
                      item.img ||
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                    }
                    alt={item.title}
                  />
                  {item.type && (
                    <span className={`item-type-badge ${item.type}`}>
                      {item.type === "veg" ? "🌱" : "🍖"}
                    </span>
                  )}
                </div>

                <div className="cart-item-details">
                  <div className="cart-item-title-row">
                    <div>
                      <h3 className="item-title">{item.title}</h3>
                      <div className="item-unit-price">
                        ₹{(item.itemPrice || item.price).toFixed(2)} per plate
                      </div>
                    </div>
                    <button
                      className="cart-remove-icon-btn"
                      onClick={() => removeFromCart(index)}
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  {/* Customization Details Badges */}
                  <div className="cart-item-custom-box">
                    {item.customizations && item.customizations.length > 0 ? (
                      <div className="custom-badges-wrap">
                        {item.customizations.map((c, i) => {
                          if (c.status === "removed") {
                            return (
                              <span key={i} className="cust-badge removed">
                                {c.name}: <s>Removed</s> ✗
                              </span>
                            );
                          }
                          if (c.status === "extra") {
                            return (
                              <span key={i} className="cust-badge extra">
                                + {c.name} ({c.change})
                              </span>
                            );
                          }
                          return null;
                        })}
                        {!item.customizations.some(
                          (c) => c.status === "removed" || c.status === "extra"
                        ) && (
                          <span className="cust-badge standard">Standard Recipe</span>
                        )}
                      </div>
                    ) : item.customizationSummary ? (
                      <div className="custom-summary-pill">
                        👉 {item.customizationSummary}
                      </div>
                    ) : (
                      <span className="cust-badge standard">Chef's Standard Recipe</span>
                    )}
                  </div>

                  {/* Item Actions: Quantity Stepper & Line Subtotal */}
                  <div className="cart-item-actions">
                    <div className="cart-qty-picker">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="qty-num">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>

                    <div className="cart-item-subtotal">
                      Item Total: <b>₹{((item.itemPrice || item.price) * item.quantity).toFixed(2)}</b>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Special Instructions / Chef Notes Box */}
            <div className="order-notes-card">
              <label htmlFor="order-notes" className="notes-label">
                📝 Cooking or Delivery Instructions (Optional)
              </label>
              <textarea
                id="order-notes"
                placeholder="e.g. Please make it spicy, don't ring the doorbell, pack extra green chutney..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                rows="2"
                className="order-notes-input"
              />
            </div>

            {/* Tip the Delivery Hero */}
            <div className="rider-tip-card">
              <div className="tip-header">
                <FaMotorcycle className="tip-icon" />
                <div>
                  <h4>Tip your delivery partner</h4>
                  <p>100% of the tip goes directly to your rider hero</p>
                </div>
              </div>
              <div className="tip-buttons-row">
                {[0, 10, 20, 30, 50].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className={`tip-btn ${riderTip === amount ? "active" : ""}`}
                    onClick={() => setRiderTip(amount)}
                  >
                    {amount === 0 ? "Not now" : `₹${amount}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Bill Summary & Checkout */}
          <div className="cart-summary-column">
            {/* Promo Code Card */}
            <div className="promo-code-card">
              <div className="promo-card-title">
                <FaTag style={{ color: "var(--brand-orange)" }} /> Have a Promo Code?
              </div>

              {appliedPromo ? (
                <div className="applied-promo-box">
                  <div>
                    <div className="applied-promo-code">
                      <FaCheckCircle style={{ color: "#22C55E" }} /> {appliedPromo.code} Applied!
                    </div>
                    <div className="applied-promo-desc">{appliedPromo.desc}</div>
                  </div>
                  <button
                    type="button"
                    className="remove-promo-btn"
                    onClick={handleRemovePromo}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="promo-input-row">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="promo-input"
                  />
                  <button
                    type="button"
                    className="apply-promo-btn"
                    onClick={() => handleApplyPromo()}
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* Clickable Quick Coupon Pills */}
              {!appliedPromo && (
                <div className="quick-coupons-wrap">
                  <span className="quick-coupon-label">Available for you:</span>
                  <div className="quick-coupon-pills">
                    {PROMO_CODES.map((p) => (
                      <button
                        key={p.code}
                        type="button"
                        className="quick-coupon-pill"
                        onClick={() => handleApplyPromo(p)}
                      >
                        <b>{p.code}</b> ({p.desc})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bill Summary Card */}
            <div className="cart-bill-summary-card">
              <h3 className="summary-title">Order Bill Breakdown</h3>
              <div className="bill-rows">
                <div className="bill-row">
                  <span>Items Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="bill-row">
                  <span>Delivery Partner Fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="free-delivery-badge">FREE</span>
                    ) : (
                      `₹${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="bill-row">
                  <span>Packaging & Handling</span>
                  <span>₹{packagingFee.toFixed(2)}</span>
                </div>

                {riderTip > 0 && (
                  <div className="bill-row">
                    <span>Delivery Partner Tip</span>
                    <span>₹{riderTip.toFixed(2)}</span>
                  </div>
                )}

                {promoDiscount > 0 && (
                  <div className="bill-row discount-row">
                    <span>Coupon Discount ({appliedPromo?.code})</span>
                    <span className="discount-amount">- ₹{promoDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="bill-divider"></div>

                <div className="bill-row grand-total">
                  <div>
                    <span className="total-label">Grand Total:</span>
                    <span className="tax-inclusive-label">(Inclusive of all taxes)</span>
                  </div>
                  <span className="total-amount">₹{Math.round(grandTotal).toFixed(2)}</span>
                </div>
              </div>

              <div className="safe-delivery-guarantee">
                <FaShieldAlt style={{ color: "#22C55E", fontSize: "1.1rem" }} />
                <span>100% Safe, Contactless & Hygienic Packaging Guaranteed</span>
              </div>

              <button
                className="checkout-proceed-btn"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Checkout Bar (Fixed above bottom nav on small screens) */}
      {cartItems.length > 0 && (
        <div className="mobile-sticky-checkout-bar">
          <div className="mobile-bar-total">
            <span className="mobile-total-label">Grand Total</span>
            <span className="mobile-total-val">₹{Math.round(grandTotal)}</span>
          </div>
          <button
            className="mobile-bar-checkout-btn"
            onClick={handleProceedToCheckout}
          >
            Checkout ({cartItems.reduce((acc, it) => acc + it.quantity, 0)} items) →
          </button>
        </div>
      )}

      {/* Delivery Checkout Modal */}
      {showCheckoutModal && (
        <div className="checkout-modal-backdrop" onClick={() => setShowCheckoutModal(false)}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="modal-icon">📍</span>
                <h2>Delivery Address & Checkout</h2>
              </div>
              <button
                className="close-modal-btn"
                onClick={() => setShowCheckoutModal(false)}
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="checkout-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="e.g. Bikram"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="e.g. Singh"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Contact Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Complete House Address / Flat / Street *</label>
                  <input
                    type="text"
                    name="street"
                    placeholder="Flat 402, Sunshine Apts, 5th Cross Road"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="e.g. Bengaluru / New Delhi"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>State / Region</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="e.g. Karnataka"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Pincode / Postal Code</label>
                  <input
                    type="text"
                    name="zipcode"
                    placeholder="e.g. 560001"
                    value={formData.zipcode}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Interactive Payment Method Selector */}
                <div className="form-group full-width">
                  <label>Select Payment Option</label>
                  <div className="payment-options-grid">
                    <label
                      className={`payment-card-option ${
                        formData.paymentMethod === "COD" ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={formData.paymentMethod === "COD"}
                        onChange={handleInputChange}
                      />
                      <div className="payment-option-content">
                        <span className="payment-icon">💵</span>
                        <div>
                          <div className="payment-name">Cash on Delivery (COD)</div>
                          <div className="payment-sub">Pay in cash or UPI upon delivery</div>
                        </div>
                      </div>
                    </label>

                    <label
                      className={`payment-card-option ${
                        formData.paymentMethod === "UPI" ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="UPI"
                        checked={formData.paymentMethod === "UPI"}
                        onChange={handleInputChange}
                      />
                      <div className="payment-option-content">
                        <span className="payment-icon">⚡</span>
                        <div>
                          <div className="payment-name">Instant UPI / QR</div>
                          <div className="payment-sub">GPay, PhonePe, Paytm QR</div>
                        </div>
                      </div>
                    </label>

                    <label
                      className={`payment-card-option ${
                        formData.paymentMethod === "Card" ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Card"
                        checked={formData.paymentMethod === "Card"}
                        onChange={handleInputChange}
                      />
                      <div className="payment-option-content">
                        <span className="payment-icon">💳</span>
                        <div>
                          <div className="payment-name">Credit / Debit Card</div>
                          <div className="payment-sub">Visa, Mastercard, RuPay</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Order Pay Summary in Modal */}
              <div className="modal-total-summary">
                <div>
                  <span className="modal-total-label">Final Payable Amount:</span>
                  <span className="modal-items-count">
                    ({cartItems.reduce((acc, it) => acc + it.quantity, 0)} items)
                  </span>
                </div>
                <b className="modal-total-val">₹{Math.round(grandTotal)}</b>
              </div>

              <button
                type="submit"
                className="place-order-confirm-btn"
                disabled={submitting}
              >
                {submitting ? "Placing Order..." : `Confirm & Place Order (₹${Math.round(grandTotal)})`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
