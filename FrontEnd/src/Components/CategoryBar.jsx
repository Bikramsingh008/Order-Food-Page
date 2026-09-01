import React from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryBar.css";

const CATEGORIES = [
  {
    name: "Snacks",
    count: "12 Items",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Breakfast",
    count: "11 Items",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Lunch",
    count: "13 Items",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Dinner",
    count: "10 Items",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Drinks",
    count: "11 Items",
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=400&q=80",
  },
];

const CategoryBar = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/ourfood?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="yf-category-section">
      <div className="section-container">
        <div className="yf-category-header">
          <h2 className="section-heading">Explore By Category</h2>
          <p className="section-sub">
            Handpicked menus for every craving and time of day
          </p>
        </div>

        <div className="yf-category-grid">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="yf-category-card"
              onClick={() => handleCategoryClick(cat.name)}
            >
              <div className="yf-category-img-wrapper">
                <img src={cat.image} alt={cat.name} />
              </div>
              <span className="yf-category-name">{cat.name}</span>
              <span className="yf-category-count">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryBar;
