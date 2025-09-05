import React from "react";
import "./Delivery.css";
import pizza from "../assets/pizza.jpeg";
import { Link } from 'react-router-dom';

const Delivery = () => {
  return (
    <section className="delivery-section">
      <div className="delivery-container">
        
        {/* Left Text Section */}
        <div className="delivery-text">
          <h1 className="delivery-heading">
            Satisfy your <br />
            <span>
              Taste-buds.<span className="highlight">2.0</span>
            </span>
          </h1>
          <p className="delivery-paragraph">
            <span className="bold">Pastries, cakes, cookies.</span>
            We’ve got you covered — who says you need to break the bank to
            satisfy your sweet, sweet tooth.
          </p>
          <Link to="/ourfood">
          <button className="custom-btn">
            Order a meal
          </button></Link>
        </div>

        {/* Right Image Section */}
        {/* Right Image Section */}
<div className="delivery-image-wrapper">
  <div className="circle-border">
    <img
      src={pizza}
      alt="Pizza"
      className="delivery-image"
    />
  </div>

  {/* Labels */}
  <span className="label top-label">Your favorite toppings</span>
  <span className="label right-label">Fast Food Fast</span>
  <span className="label bottom-label">Kiddies delight!</span>
</div>

      </div>
    </section>
  );
};

export default Delivery;
