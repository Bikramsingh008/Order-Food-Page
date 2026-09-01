import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="yf-footer">
      <div className="section-container">
        <div className="yf-footer-grid">
          {/* Brand Info */}
          <div>
            <Link to="/" className="yf-logo" style={{ textDecoration: "none" }}>
              <div className="yf-logo-icon">🍔</div>
              <span className="yf-logo-text">
                Yummy<span style={{ color: "var(--brand-orange)" }}>Food</span>
              </span>
            </Link>
            <p className="yf-footer-brand-desc">
              Your favorite food ordering platform bringing chef-crafted Indian
              and fusion delicacies straight to your doorstep in minutes.
            </p>
            <div className="yf-footer-socials">
              <a href="#" className="yf-footer-social-icon" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="yf-footer-social-icon" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="yf-footer-social-icon" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="yf-footer-social-icon" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="yf-footer-title">Quick Links</h4>
            <ul className="yf-footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/ourfood">Explore Menu</Link>
              </li>
              <li>
                <Link to="/aboutus">About Us</Link>
              </li>
              <li>
                <Link to="/cart">My Cart</Link>
              </li>
              <li>
                <Link to="/signin">Account Login</Link>
              </li>
            </ul>
          </div>

          {/* Top Categories */}
          <div>
            <h4 className="yf-footer-title">Categories</h4>
            <ul className="yf-footer-links">
              <li>
                <Link to="/ourfood?category=Snacks">Snacks & Starters</Link>
              </li>
              <li>
                <Link to="/ourfood?category=Breakfast">North & South Breakfast</Link>
              </li>
              <li>
                <Link to="/ourfood?category=Lunch">Thalis & Curries</Link>
              </li>
              <li>
                <Link to="/ourfood?category=Dinner">Biryani Specials</Link>
              </li>
              <li>
                <Link to="/ourfood?category=Drinks">Beverages & Shakes</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="yf-footer-title">Contact & Support</h4>
            <div className="yf-footer-contact-item">
              <FaMapMarkerAlt className="yf-footer-contact-icon" />
              <span>124 Gourmet Boulevard, Foodie Plaza, Sector 18, Cyber City</span>
            </div>
            <div className="yf-footer-contact-item">
              <FaPhoneAlt className="yf-footer-contact-icon" />
              <span>+91 1800-FOOD-YUMMY (Toll-Free)</span>
            </div>
            <div className="yf-footer-contact-item">
              <FaEnvelope className="yf-footer-contact-icon" />
              <span>support@yummyfood.com</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="yf-footer-bottom">
          <p>© {new Date().getFullYear()} YummyFood Technologies Pvt. Ltd. All rights reserved.</p>
          <div style={{ display: "flex", gap: "20px" }}>
            <span style={{ cursor: "pointer" }}>Privacy Policy</span>
            <span style={{ cursor: "pointer" }}>Terms of Service</span>
            <span style={{ cursor: "pointer" }}>FSSAI Cert #1002930400192</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
