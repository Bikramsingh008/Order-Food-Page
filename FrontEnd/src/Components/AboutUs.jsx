import React from "react";
import "./AboutUs.css";
import { Link } from "react-router-dom";
import { FaCode, FaRocket, FaUtensils, FaHeart, FaShieldAlt } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="about-page-container">
      {/* Hero Header */}
      <div className="about-hero-section">
        <h1 className="about-hero-title">Welcome to YummyFood</h1>
        <p className="about-hero-subtitle">
          Crafting exceptional food delivery experiences with authentic recipes,
          lightning-fast delivery, and state-of-the-art web technology.
        </p>
      </div>

      {/* ABOUT YUMMYFOOD FEATURES */}
      <div className="about-features-grid">
        <div className="about-feature-card">
          <div className="feature-icon">🥗</div>
          <h3 className="feature-title">Fresh & Authentic</h3>
          <p className="feature-desc">
            Sourced daily from top local suppliers to ensure maximum flavor, nutrition, and quality.
          </p>
        </div>

        <div className="about-feature-card">
          <div className="feature-icon">🚀</div>
          <h3 className="feature-title">30-Min Fast Delivery</h3>
          <p className="feature-desc">
            Hot and fresh meals delivered straight to your doorstep with real-time stage progress tracking.
          </p>
        </div>

        <div className="about-feature-card">
          <div className="feature-icon">⭐</div>
          <h3 className="feature-title">5-Star Customer Rating</h3>
          <p className="feature-desc">
            Loved by foodies across the city with interactive post-delivery reviews and feedback.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="about-cta-box">
        <h3>Ready to Experience Delicious Food?</h3>
        <p>Explore over 50+ curated dishes crafted by expert chefs and delivered fast.</p>
        <Link to="/ourfood">
          <button className="brand-btn" style={{ padding: "14px 36px", fontSize: "1rem" }}>
            🍔 Explore Full Menu
          </button>
        </Link>
      </div>

      {/* MEET THE DEVELOPER & FOUNDER SPOTLIGHT */}
      <div className="dev-spotlight-card">
        <div className="dev-avatar-container">
          <img
            src="https://api.dicebear.com/7.x/adventurer/svg?seed=Bikram"
            alt="Bikram Singh Koranga"
            className="dev-avatar-img"
          />
          <div className="dev-badge-label">⚡ Founder & Lead Architect</div>
        </div>

        <div className="dev-info">
          <div className="dev-tag">👨‍💻 Meet the Developer</div>
          <h2 className="dev-name">Bikram Singh Koranga</h2>
          <div className="dev-role">Creator, Lead Full-Stack Engineer & Product Designer</div>

          <div className="dev-quote">
            "At YummyFood, my vision was to build more than just a food ordering app — I wanted to create a production-grade, highly intuitive digital dining platform that connects food lovers with top-quality gourmet dishes seamlessly."
          </div>

          <div className="dev-skills-list">
            <span className="dev-skill-pill">🚀 Full-Stack Engineering</span>
            <span className="dev-skill-pill">⚡ React & Node.js</span>
            <span className="dev-skill-pill">🍃 MongoDB Database</span>
            <span className="dev-skill-pill">🎨 Modern UI/UX Design</span>
            <span className="dev-skill-pill">🛒 Live Order Tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
