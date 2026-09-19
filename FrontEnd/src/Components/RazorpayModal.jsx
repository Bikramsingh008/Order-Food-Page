import React, { useState } from "react";
import { FaTimes, FaShieldAlt, FaCheckCircle, FaCreditCard, FaQrcode, FaUniversity, FaWallet, FaLock, FaArrowRight } from "react-icons/fa";
import "./RazorpayModal.css";

const RazorpayModal = ({ isOpen, onClose, amount, customerData, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("upi"); // 'upi' | 'card' | 'netbanking' | 'wallet'
  const [upiId, setUpiId] = useState("");
  const [selectedApp, setSelectedApp] = useState("gpay");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState(customerData?.name || "");
  const [selectedBank, setSelectedBank] = useState("HDFC");
  const [selectedWallet, setSelectedWallet] = useState("amazon");

  // Payment Processing & Success Animation state
  const [processingState, setProcessingState] = useState("idle"); // 'idle' | 'processing' | 'success'
  const [paymentId, setPaymentId] = useState("");

  if (!isOpen) return null;

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 16);
    val = val.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(val);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 3) {
      val = val.slice(0, 2) + "/" + val.slice(2);
    }
    setCardExpiry(val);
  };

  const handlePayNow = () => {
    setProcessingState("processing");
    const generatedPayId = "pay_rzp_" + Math.random().toString(36).substring(2, 11).toUpperCase();
    setPaymentId(generatedPayId);

    // Simulate 1.5s Razorpay bank processing delay
    setTimeout(() => {
      setProcessingState("success");
      // After success animation, notify parent
      setTimeout(() => {
        if (onSuccess) {
          onSuccess({
            paymentId: generatedPayId,
            paymentMethod: "Razorpay",
            isPaid: true
          });
        }
      }, 1400);
    }, 1800);
  };

  return (
    <div className="rzp-backdrop" onClick={processingState === "idle" ? onClose : undefined}>
      <div className="rzp-modal" onClick={(e) => e.stopPropagation()}>
        {/* Top Razorpay Header Bar */}
        <div className="rzp-header">
          <div className="rzp-header-left">
            <div className="rzp-brand-badge">
              <span className="rzp-logo-symbol">⚡</span>
              <span className="rzp-brand-title">razorpay</span>
            </div>
            <div className="rzp-merchant-info">
              <h3 className="rzp-merchant-name">YummyFood Gourmet</h3>
              <p className="rzp-order-ref">
                Order #{Math.floor(100000 + Math.random() * 900000)} • {customerData?.email || "customer@food.com"}
              </p>
            </div>
          </div>

          <div className="rzp-header-right">
            <div className="rzp-amount-display">
              <span className="rzp-amount-label">Payable Amount</span>
              <span className="rzp-amount-value">₹{Number(amount).toFixed(2)}</span>
            </div>
            {processingState === "idle" && (
              <button className="rzp-close-btn" onClick={onClose} title="Cancel Payment">
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Test Mode Warning Bar */}
        <div className="rzp-test-mode-banner">
          <span className="rzp-test-pill">TEST MODE / DUMMY GATEWAY</span>
          <span>No real money will be charged to your bank account</span>
        </div>

        {/* Modal Body / Processing Screens */}
        {processingState === "processing" ? (
          <div className="rzp-processing-view">
            <div className="rzp-spinner"></div>
            <h3>Connecting to Bank Gateway...</h3>
            <p>Processing payment of <b>₹{Number(amount).toFixed(2)}</b> via Razorpay</p>
            <span className="rzp-dont-close">Please do not refresh or close this tab</span>
          </div>
        ) : processingState === "success" ? (
          <div className="rzp-success-view">
            <div className="rzp-success-icon-wrap">
              <FaCheckCircle className="rzp-success-checkmark" />
            </div>
            <h3>Payment Approved!</h3>
            <p className="rzp-pay-id">Transaction ID: <b>{paymentId}</b></p>
            <p className="rzp-success-sub">Order is being confirmed with YummyFood Kitchen...</p>
          </div>
        ) : (
          <div className="rzp-body">
            {/* Sidebar Navigation */}
            <div className="rzp-sidebar">
              <button
                className={`rzp-nav-item ${activeTab === "upi" ? "active" : ""}`}
                onClick={() => setActiveTab("upi")}
              >
                <FaQrcode className="rzp-nav-icon" />
                <div>
                  <div className="rzp-nav-title">UPI / QR</div>
                  <div className="rzp-nav-sub">Google Pay, PhonePe, Paytm</div>
                </div>
              </button>

              <button
                className={`rzp-nav-item ${activeTab === "card" ? "active" : ""}`}
                onClick={() => setActiveTab("card")}
              >
                <FaCreditCard className="rzp-nav-icon" />
                <div>
                  <div className="rzp-nav-title">Card</div>
                  <div className="rzp-nav-sub">Visa, Mastercard, RuPay</div>
                </div>
              </button>

              <button
                className={`rzp-nav-item ${activeTab === "netbanking" ? "active" : ""}`}
                onClick={() => setActiveTab("netbanking")}
              >
                <FaUniversity className="rzp-nav-icon" />
                <div>
                  <div className="rzp-nav-title">Netbanking</div>
                  <div className="rzp-nav-sub">All Indian Banks</div>
                </div>
              </button>

              <button
                className={`rzp-nav-item ${activeTab === "wallet" ? "active" : ""}`}
                onClick={() => setActiveTab("wallet")}
              >
                <FaWallet className="rzp-nav-icon" />
                <div>
                  <div className="rzp-nav-title">Wallets</div>
                  <div className="rzp-nav-sub">Amazon Pay, Paytm, Mobikwik</div>
                </div>
              </button>
            </div>

            {/* Content Area */}
            <div className="rzp-content">
              {/* UPI Tab */}
              {activeTab === "upi" && (
                <div className="rzp-tab-pane">
                  <h4 className="rzp-pane-title">Pay using Instant UPI</h4>

                  <div className="rzp-upi-apps">
                    {[
                      { id: "gpay", name: "Google Pay", icon: "🟢", color: "#4285F4" },
                      { id: "phonepe", name: "PhonePe", icon: "🟣", color: "#5F259F" },
                      { id: "paytm", name: "Paytm UPI", icon: "🔵", color: "#00B9F1" },
                      { id: "bhim", name: "BHIM UPI", icon: "🟠", color: "#FF6600" },
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        className={`rzp-app-chip ${selectedApp === app.id ? "selected" : ""}`}
                        onClick={() => setSelectedApp(app.id)}
                      >
                        <span className="rzp-app-icon">{app.icon}</span>
                        <span>{app.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* QR Code Demo */}
                  <div className="rzp-qr-box">
                    <div className="rzp-qr-code-dummy">
                      <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor">
                        <path d="M0,0 h35 v35 h-35 z M10,10 v15 h15 v-15 z M65,0 h35 v35 h-35 z M75,10 v15 h15 v-15 z M0,65 h35 v35 h-35 z M10,75 v15 h15 v-15 z M45,10 h10 v10 h-10 z M45,35 h20 v10 h-20 z M35,55 h15 v15 h-15 z M65,65 h15 v15 h-15 z M85,85 h15 v15 h-15 z M55,85 h15 v15 h-15 z M85,55 h15 v15 h-15 z" />
                      </svg>
                      <div className="rzp-qr-center-badge">⚡ Razorpay</div>
                    </div>
                    <p className="rzp-qr-text">Scan & Pay using any UPI App</p>
                  </div>

                  <div className="rzp-upi-input-group">
                    <label>Or enter VPA / UPI ID</label>
                    <div className="rzp-upi-field-row">
                      <input
                        type="text"
                        placeholder="e.g. mobileNumber@upi or user@okaxis"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="rzp-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Card Tab */}
              {activeTab === "card" && (
                <div className="rzp-tab-pane">
                  <h4 className="rzp-pane-title">Enter Credit / Debit Card Details</h4>

                  <div className="rzp-form-group">
                    <label>Card Number</label>
                    <div className="rzp-card-input-wrap">
                      <input
                        type="text"
                        placeholder="4532 •••• •••• 8892"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                        className="rzp-input"
                      />
                      <span className="rzp-card-type-icon">💳</span>
                    </div>
                  </div>

                  <div className="rzp-form-row">
                    <div className="rzp-form-group">
                      <label>Expiry (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        maxLength={5}
                        className="rzp-input"
                      />
                    </div>
                    <div className="rzp-form-group">
                      <label>CVV / CVC</label>
                      <input
                        type="password"
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.slice(0, 4))}
                        maxLength={4}
                        className="rzp-input"
                      />
                    </div>
                  </div>

                  <div className="rzp-form-group">
                    <label>Name on Card</label>
                    <input
                      type="text"
                      placeholder="e.g. Bikramjit Singh"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="rzp-input"
                    />
                  </div>
                </div>
              )}

              {/* Netbanking Tab */}
              {activeTab === "netbanking" && (
                <div className="rzp-tab-pane">
                  <h4 className="rzp-pane-title">Select Popular Bank</h4>
                  <div className="rzp-banks-grid">
                    {[
                      { id: "HDFC", name: "HDFC Bank", logo: "🏦" },
                      { id: "SBI", name: "State Bank of India", logo: "🏛️" },
                      { id: "ICICI", name: "ICICI Bank", logo: "💼" },
                      { id: "AXIS", name: "Axis Bank", logo: "💳" },
                      { id: "KOTAK", name: "Kotak Mahindra", logo: "📈" },
                      { id: "PNB", name: "Punjab National Bank", logo: "🏧" },
                    ].map((bank) => (
                      <button
                        key={bank.id}
                        type="button"
                        className={`rzp-bank-card ${selectedBank === bank.id ? "selected" : ""}`}
                        onClick={() => setSelectedBank(bank.id)}
                      >
                        <span className="rzp-bank-logo">{bank.logo}</span>
                        <span className="rzp-bank-name">{bank.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Wallet Tab */}
              {activeTab === "wallet" && (
                <div className="rzp-tab-pane">
                  <h4 className="rzp-pane-title">Select Wallet</h4>
                  <div className="rzp-wallets-list">
                    {[
                      { id: "amazon", name: "Amazon Pay Wallet", icon: "🛒" },
                      { id: "paytm", name: "Paytm Wallet & Postpaid", icon: "👛" },
                      { id: "mobikwik", name: "Mobikwik Wallet", icon: "⚡" },
                      { id: "phonepe", name: "PhonePe Wallet", icon: "📱" },
                    ].map((wallet) => (
                      <button
                        key={wallet.id}
                        type="button"
                        className={`rzp-wallet-row ${selectedWallet === wallet.id ? "selected" : ""}`}
                        onClick={() => setSelectedWallet(wallet.id)}
                      >
                        <span className="rzp-wallet-icon">{wallet.icon}</span>
                        <span className="rzp-wallet-name">{wallet.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pay Now Button */}
              <div className="rzp-action-area">
                <button
                  type="button"
                  className="rzp-pay-button"
                  onClick={handlePayNow}
                >
                  <FaLock className="rzp-pay-lock-icon" />
                  <span>Pay ₹{Number(amount).toFixed(2)}</span>
                  <FaArrowRight />
                </button>

                <div className="rzp-security-footer">
                  <FaShieldAlt className="rzp-shield-icon" />
                  <span>256-Bit SSL Encrypted • Razorpay Trusted Security</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RazorpayModal;
