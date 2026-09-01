import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./OurFood.css";
import { API_URL } from "../utils/api";

const categories = ["All", "Snacks", "Breakfast", "Lunch", "Dinner", "Drinks"];

const OurFood = ({ handleCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterType, setFilterType] = useState("All"); // All, veg, non-veg
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Parse query params on load (e.g., ?category=Breakfast or ?search=burger)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get("category");
    const searchParam = params.get("search");

    if (catParam && categories.includes(catParam)) {
      setSelectedCategory(catParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/product/list`);
      if (res.data.success) {
        setProducts(res.data.products);
      } else {
        toast.error(res.data.message || "Failed to fetch menu items");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to connect to backend service");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on Category, Veg/Non-Veg Filter, and Search
  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    const matchesType = filterType === "All" || item.type === filterType;

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesType && matchesSearch;
  });

  return (
    <div className="ourfood-container">
      {/* Header Banner */}
      <div className="menu-header">
        <h1 className="menu-title-main">Explore Our Delicious Menu</h1>
        <p className="menu-subtitle">
          Freshly prepared, highly customizable & delivered hot to your doorstep.
        </p>

        {/* Search Bar */}
        <div className="search-box-wrapper">
          <input
            type="text"
            placeholder="Search for biryani, dosa, burger, chai..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs Bar */}
      <div className="category-tabs-container">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`cat-tab-btn ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => {
              setSelectedCategory(cat);
              navigate(`/ourfood?category=${encodeURIComponent(cat)}`, { replace: true });
            }}
          >
            {cat === "Snacks" && "🍟 "}
            {cat === "Breakfast" && "🥞 "}
            {cat === "Lunch" && "🍛 "}
            {cat === "Dinner" && "🍱 "}
            {cat === "Drinks" && "🥤 "}
            {cat === "All" && "🍽️ "}
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Controls Row: Veg / Non-Veg / All */}
      <div className="filter-controls-bar">
        <div className="dietary-filter-group">
          <span className="filter-label">Dietary Preference:</span>
          <button
            className={`filter-toggle-btn ${filterType === "All" ? "active-all" : ""}`}
            onClick={() => setFilterType("All")}
          >
            All Items
          </button>
          <button
            className={`filter-toggle-btn ${filterType === "veg" ? "active-veg" : ""}`}
            onClick={() => setFilterType("veg")}
          >
            🟢 Pure Veg Only
          </button>
          <button
            className={`filter-toggle-btn ${filterType === "non-veg" ? "active-nonveg" : ""}`}
            onClick={() => setFilterType("non-veg")}
          >
            🔴 Non-Veg Only
          </button>
        </div>

        <div className="item-count-badge">
          Showing <b>{filteredProducts.length}</b> delicious option
          {filteredProducts.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Food Items Grid */}
      <div className="food-grid-section">
        {loading ? (
          <div className="menu-loading-box">
            <div className="spinner"></div>
            <p>Loading hot dishes from kitchen...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="no-items-found">
            <span className="empty-icon">🔍</span>
            <h3>No items match your filter criteria</h3>
            <p>Try switching category tabs or clearing your search filter.</p>
            <button
              className="reset-filters-btn"
              onClick={() => {
                setSelectedCategory("All");
                setFilterType("All");
                setSearchQuery("");
                navigate("/ourfood", { replace: true });
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="food-cards-grid">
            {filteredProducts.map((item) => (
              <div key={item._id} className="food-card">
                {/* Clickable Image Banner */}
                <div
                  className="food-card-img-wrapper"
                  onClick={() => navigate(`/food/${item._id}`)}
                >
                  <img
                    src={
                      item.img?.[0] ||
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                    }
                    alt={item.title}
                    className="food-card-image"
                  />
                  <span className={`diet-pill ${item.type}`}>
                    {item.type === "veg"
                      ? "🌱 Veg"
                      : `🍖 Non-Veg ${item.subType ? `(${item.subType})` : ""}`}
                  </span>
                  <span className="category-pill">{item.category}</span>
                </div>

                {/* Card Content */}
                <div className="food-card-content">
                  <h3
                    className="food-card-title"
                    onClick={() => navigate(`/food/${item._id}`)}
                  >
                    {item.title}
                  </h3>

                  <p className="food-card-desc">
                    {item.description
                      ? item.description.length > 85
                        ? item.description.substring(0, 85) + "..."
                        : item.description
                      : "Fresh & delicious recipe crafted with rich ingredients."}
                  </p>

                  <div className="customization-indicator">
                    {item.customizations && item.customizations.length > 0 ? (
                      <span className="cust-available">
                        ✨ {item.customizations.length} Customization Options Available
                      </span>
                    ) : (
                      <span className="cust-standard">Standard Recipe</span>
                    )}
                  </div>

                  <div className="food-card-footer">
                    <span className="food-card-price">
                      ₹{Number(item.price).toFixed(2)}
                    </span>
                    <button
                      className="customize-order-btn"
                      onClick={() => navigate(`/food/${item._id}`)}
                    >
                      Customize & Order →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OurFood;
