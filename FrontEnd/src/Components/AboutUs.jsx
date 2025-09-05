import React from 'react';
import './AboutUs.css';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-overlay">
        <div className="about-section">
          <h1>Welcome to YummyFood</h1>
          <p>
            At <strong>YummyFood</strong>, we believe that food is more than just fuel — it’s a celebration of flavor, tradition, and creativity. Our mission is to bring delicious, high-quality meals straight to your table, made with love and the freshest ingredients.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Story</h2>
          <p>Founded in 2020, YummyFood began as a small kitchen with a big dream. Today, we’re proud to be a growing team of food lovers passionate about delivering joy through every bite.</p>
        </div>

        <div className="about-section">
          <h2>Why Choose Us?</h2>
          <ul className="about-list">
            <li>🍽️ <strong>Fresh Ingredients</strong> – Sourced locally for quality and flavor.</li>
            <li>👨‍🍳 <strong>Expert Chefs</strong> – Every dish made with care and creativity.</li>
            <li>🚀 <strong>Fast Delivery</strong> – Hot and delicious food, always on time.</li>
            <li>💬 <strong>Customer Love</strong> – Rated 5 stars by foodies across the city.</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>Ready to Taste the Magic?</h2>
          <Link to="/ourfood">
            <button className="explore-button">Explore Our Menu</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
