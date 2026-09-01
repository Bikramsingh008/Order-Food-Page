import React from "react";
import "./WhyUs.css";
import { FaRocket, FaUtensils, FaShieldAlt } from "react-icons/fa";

const REASONS = [
  {
    icon: <FaRocket />,
    title: "Superfast 30-Min Delivery",
    desc: "Our real-time order tracking and optimized delivery network ensure your food arrives piping hot every single time.",
  },
  {
    icon: <FaUtensils />,
    title: "Authentic Recipes & Freshness",
    desc: "Prepared by master chefs using premium, locally sourced spices and fresh ingredients. Zero artificial preservatives.",
  },
  {
    icon: <FaShieldAlt />,
    title: "100% Hygienic Packaging",
    desc: "Tamper-proof, eco-friendly thermal packaging that maintains freshness and temperature until it reaches your table.",
  },
];

const WhyUs = () => {
  return (
    <section className="yf-whyus-section">
      <div className="section-container">
        <div style={{ textAlign: "center" }}>
          <h2 className="section-heading">Why Order From YummyFood?</h2>
          <p className="section-sub">
            We don't just deliver food — we bring restaurant-quality dining experience home.
          </p>
        </div>

        <div className="yf-whyus-grid">
          {REASONS.map((r, i) => (
            <div className="yf-whyus-card" key={i}>
              <div className="yf-whyus-icon">{r.icon}</div>
              <h3 className="yf-whyus-card-title">{r.title}</h3>
              <p className="yf-whyus-card-desc">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
