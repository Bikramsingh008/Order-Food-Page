import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../utils/api";
import "./Cart.css";

const Cart = ({ cartItems, updateQuantity, removeFromCart, clearCart }) => {
  const navigate = useNavigate();

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Delivery form state
  const [formData, setFormData] = useState({
    firstName: user?.name ? user.name.split(" ")[0] : "",
    lastName: user?.name ? user.name.split(" ").slice(1).join(" ") : "",
    email: user?.email || "",
    phone: "",
    street: "",
    city: "New Delhi",
    state: "Delhi",
    zipcode: "110001",
    paymentMethod: "COD"
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calculate cart subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.itemPrice || item.price) * item.quantity,
    0
  );

  const deliveryFee = subtotal > 0 ? (subtotal > 499 ? 0 : 40) : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleProceedToCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please sign in to complete your order.");
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
    if (!formData.phone || !formData.street) {
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

      // Prepare order items payload with human readable customization string
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
          productId: item.productId || item.id,
          title: item.title,
          basePrice: item.basePrice || item.price,
          itemPrice: item.itemPrice || item.price,
          quantity: item.quantity,
          img: item.img,
          customizations: item.customizations || [],
          customizationSummary: customizationText
            ? `${item.title} x${item.quantity} — ${customizationText}`
            : `${item.title} x${item.quantity}`
        };
      });

      const orderPayload = {
        items: orderItems,
        amount: grandTotal,
        address: formData,
        paymentMethod: formData.paymentMethod
      };

      const res = await axios.post(`${API_URL}/order/place`, orderPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success("🎉 Order placed successfully!");
        setPlacedOrderDetails({
          orderId: res.data.orderId,
          total: grandTotal,
          address: formData,
          items: orderItems
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

  // If order was successfully placed, display confirmation receipt view
  if (placedOrderDetails) {
    return (
      <div className="cart-container">
        <div className="order-success-card">
          <div className="success-icon-badge">🎉</div>
          <h2>Order Confirmed!</h2>
          <p className="order-id-text">
            Order Reference ID: <b>#{placedOrderDetails.orderId}</b>
          </p>

          <div className="success-summary-box">
            <h4>Delivery Address:</h4>
            <p>
              {placedOrderDetails.address.firstName} {placedOrderDetails.address.lastName} ({placedOrderDetails.address.phone})
            </p>
            <p>{placedOrderDetails.address.street}, {placedOrderDetails.address.city}, {placedOrderDetails.address.state}</p>

            <h4 style={{ marginTop: "15px" }}>Ordered Items Summary:</h4>
            <ul className="success-item-list">
              {placedOrderDetails.items.map((it, idx) => (
                <li key={idx}>
                  <b>{it.title}</b> x {it.quantity} — ₹{it.itemPrice * it.quantity}
                  {it.customizationSummary && (
                    <span className="success-cust-summary"> ({it.customizationSummary})</span>
                  )}
                </li>
              ))}
            </ul>

            <div className="success-total-row">
              <span>Total Paid:</span>
              <span>₹{placedOrderDetails.total}</span>
            </div>
          </div>

          <div className="success-actions">
            <button
              className="continue-btn"
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
      <div className="cart-header">
        <h1>🛒 Your Custom Cart</h1>
        <p>Review your customized food items before placing your order.</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart-view">
          <div className="empty-cart-icon">🍽️</div>
          <h2>Your cart is empty!</h2>
          <p>Explore our menu and customize delicious dishes to your liking.</p>
          <Link to="/ourfood" className="browse-menu-btn">
            Browse Menu Now →
          </Link>
        </div>
      ) : (
        <div className="cart-content-layout">
          {/* Items List */}
          <div className="cart-items-section">
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
                </div>

                <div className="cart-item-details">
                  <div className="cart-item-title-row">
                    <h3>{item.title}</h3>
                    <span className="item-unit-price">
                      ₹{item.itemPrice || item.price} / item
                    </span>
                  </div>

                  {/* Customization Details List */}
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
                                {c.name}: {c.change}
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
                    ) : (
                      <span className="cust-badge standard">Standard Recipe</span>
                    )}
                  </div>

                  {/* Item Actions */}
                  <div className="cart-item-actions">
                    <div className="cart-qty-picker">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        –
                      </button>
                      <span className="qty-num">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-subtotal">
                      Subtotal: <b>₹{((item.itemPrice || item.price) * item.quantity).toFixed(2)}</b>
                    </div>

                    <button
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(index)}
                      title="Remove item"
                    >
                      Remove 🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Bill Summary */}
          <div className="cart-bill-summary-card">
            <h3>Order Bill Summary</h3>
            <div className="bill-rows">
              <div className="bill-row">
                <span>Items Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="bill-row">
                <span>Delivery Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <b style={{ color: "#2e7d32" }}>FREE</b>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              {subtotal > 0 && subtotal <= 499 && (
                <p className="free-delivery-hint">
                  💡 Add items worth ₹{(500 - subtotal).toFixed(0)} more for FREE delivery!
                </p>
              )}

              <div className="bill-divider"></div>

              <div className="bill-row grand-total">
                <span>Grand Total:</span>
                <span className="total-amount">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="checkout-proceed-btn"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}

      {/* Delivery Checkout Modal */}
      {showCheckoutModal && (
        <div className="checkout-modal-backdrop">
          <div className="checkout-modal">
            <div className="modal-header">
              <h2>📍 Delivery Address & Order Details</h2>
              <button
                className="close-modal-btn"
                onClick={() => setShowCheckoutModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="checkout-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
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
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
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
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Street Address & House No.</label>
                  <input
                    type="text"
                    name="street"
                    placeholder="House 42, Connaught Place"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Pincode / Zipcode</label>
                  <input
                    type="text"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="payment-select"
                  >
                    <option value="COD">Cash on Delivery (COD)</option>
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Card">Credit / Debit Card</option>
                  </select>
                </div>
              </div>

              <div className="modal-total-summary">
                <span>Amount Payable:</span>
                <b>₹{grandTotal}</b>
              </div>

              <button
                type="submit"
                className="place-order-confirm-btn"
                disabled={submitting}
              >
                {submitting ? "Placing Order..." : "Confirm & Place Order"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
