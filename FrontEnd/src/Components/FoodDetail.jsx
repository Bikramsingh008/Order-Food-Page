import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../utils/api";
import { 
  FaArrowLeft, 
  FaPlus, 
  FaMinus, 
  FaCheck, 
  FaUtensils, 
  FaShoppingBag, 
  FaSlidersH,
  FaShieldAlt,
  FaClock,
  FaFire,
  FaChevronRight
} from "react-icons/fa";
import "./FoodDetail.css";

// ── Smart emoji icon map based on ingredient name keywords ──────────────────
const getIngredientEmoji = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("chicken"))       return "🍗";
  if (n.includes("mutton") || n.includes("rogan") || n.includes("lamb")) return "🥩";
  if (n.includes("egg"))           return "🥚";
  if (n.includes("fish") || n.includes("prawn") || n.includes("seafood")) return "🐟";
  if (n.includes("paneer") || n.includes("cottage")) return "🧀";
  if (n.includes("cheese"))        return "🫕";
  if (n.includes("butter") || n.includes("ghee") || n.includes("makhan")) return "🧈";
  if (n.includes("cream") || n.includes("malai")) return "🥛";
  if (n.includes("curd") || n.includes("raita") || n.includes("lassi") || n.includes("yogurt")) return "🫙";
  if (n.includes("rice") || n.includes("biryani") || n.includes("pulao") || n.includes("jeera")) return "🍚";
  if (n.includes("naan") || n.includes("bread") || n.includes("bun") || n.includes("roti") || n.includes("paratha") || n.includes("bhatura") || n.includes("toast")) return "🫓";
  if (n.includes("dal") || n.includes("lentil"))   return "🫘";
  if (n.includes("sauce") || n.includes("gravy") || n.includes("curry") || n.includes("masala") || n.includes("tadka") || n.includes("salan")) return "🥣";
  if (n.includes("chutney") || n.includes("pickle") || n.includes("dip") || n.includes("mayo")) return "🫙";
  if (n.includes("onion"))         return "🧅";
  if (n.includes("tomato"))        return "🍅";
  if (n.includes("chilli") || n.includes("spice") || n.includes("pepper")) return "🌶️";
  if (n.includes("lemon") || n.includes("lime"))   return "🍋";
  if (n.includes("salad") || n.includes("lettuce") || n.includes("cucumber") || n.includes("green") || n.includes("herb") || n.includes("eggplant")) return "🥗";
  if (n.includes("ice") || n.includes("cold"))     return "🧊";
  if (n.includes("sugar") || n.includes("sweet"))  return "🍬";
  if (n.includes("cashew") || n.includes("nut") || n.includes("pista") || n.includes("almond")) return "🫘";
  if (n.includes("momo") || n.includes("dumpling")) return "🥟";
  if (n.includes("samosa") || n.includes("puri") || n.includes("roll") || n.includes("fries")) return "🥐";
  if (n.includes("thali") || n.includes("platter") || n.includes("assortment")) return "🍱";
  if (n.includes("soup") || n.includes("broth"))   return "🍜";
  if (n.includes("kofta") || n.includes("tikka") || n.includes("patty")) return "🥙";
  if (n.includes("tea") || n.includes("chai") || n.includes("coffee")) return "☕";
  if (n.includes("juice") || n.includes("shake") || n.includes("lassi") || n.includes("glass")) return "🥤";
  return "🍽️";
};

// ── Bread/whole items that do NOT get half/full (ordered by count only) ──────
const BREAD_KEYWORDS = ["naan", "paratha", "roti", "laccha", "bhatura", "bread", "toast", "bun"];
const isBreadItem = (title = "") => BREAD_KEYWORDS.some(k => title.toLowerCase().includes(k));

// ── Categories eligible for Half / Full portion ─────────────────────────────
const HALF_FULL_CATEGORIES = ["Lunch", "Dinner", "Main Course", "Rice & Biryani"];

// ── Half/Full price multipliers ───────────────────────────────────────────────
const PORTION_PRICES = {
  half: 0.6,   // half portion = 60% of base price
  full: 1.0,
};

const FoodDetail = ({ handleCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Customization state: { [ingredientName]: quantity }
  const [customQuantities, setCustomQuantities] = useState({});
  const [itemQuantity, setItemQuantity] = useState(1);

  // Half / Full portion (only for Lunch & Dinner, non-bread items)
  const [portionSize, setPortionSize] = useState("full"); // "half" | "full"

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/product/single/${id}`);
      if (res.data.success && res.data.product) {
        const prod = res.data.product;
        setProduct(prod);

        // Initialize customizations state with defaultQty
        const initialCustoms = {};
        if (prod.customizations && Array.isArray(prod.customizations)) {
          prod.customizations.forEach((c) => {
            initialCustoms[c.name] = c.defaultQty ?? 1;
          });
        }
        setCustomQuantities(initialCustoms);
        setPortionSize("full"); // reset on product change

        // Fetch related products in same category
        fetchRelatedProducts(prod.category, prod._id);
      } else {
        toast.error(res.data.message || "Product not found");
      }
    } catch (error) {
      console.error("Error fetching product detail:", error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category, currentId) => {
    try {
      const res = await axios.get(`${API_URL}/product/list?category=${encodeURIComponent(category)}`);
      if (res.data.success) {
        const filtered = res.data.products.filter((p) => p._id !== currentId);
        setRelatedProducts(filtered);
      }
    } catch (err) {
      console.error("Error loading related products:", err);
    }
  };

  // Check if this product supports Half/Full
  const supportsHalfFull = product
    ? HALF_FULL_CATEGORIES.includes(product.category) && !isBreadItem(product.title)
    : false;

  const handleCustomQtyChange = (ingredient, delta) => {
    setCustomQuantities((prev) => {
      const current = prev[ingredient.name] ?? ingredient.defaultQty;
      let nextQty = current + delta;

      // If not removable, cannot reduce below defaultQty
      if (!ingredient.removable && nextQty < ingredient.defaultQty) {
        nextQty = ingredient.defaultQty;
      }
      if (nextQty < 0) nextQty = 0;
      return { ...prev, [ingredient.name]: nextQty };
    });
  };

  // Calculate customized unit price (applying portion multiplier)
  const calculateUnitPrice = () => {
    if (!product) return 0;
    let base = product.price || 0;

    // Apply half/full multiplier
    if (supportsHalfFull) {
      base = Math.round(base * PORTION_PRICES[portionSize]);
    }

    let extrasTotal = 0;
    if (product.customizations) {
      product.customizations.forEach((c) => {
        const qty = customQuantities[c.name] ?? c.defaultQty;
        if (qty > c.defaultQty) {
          extrasTotal += (qty - c.defaultQty) * (c.extraPrice || 0);
        }
      });
    }
    return base + extrasTotal;
  };

  const unitPrice = calculateUnitPrice();
  const totalPrice = unitPrice * itemQuantity;
  const halfPrice = product ? Math.round(product.price * PORTION_PRICES.half) : 0;
  const fullPrice = product ? product.price : 0;

  // Build readable customization summary string
  const getCustomizationDetails = () => {
    if (!product || !product.customizations) return { list: [], summary: "" };

    const list = [];
    const summaryParts = [];

    if (supportsHalfFull) {
      summaryParts.push(portionSize === "half" ? "Half Portion" : "Full Portion");
    }

    product.customizations.forEach((c) => {
      const qty = customQuantities[c.name] ?? c.defaultQty;
      if (qty === 0) {
        list.push({ name: c.name, change: "Removed", extraCost: 0, status: "removed" });
        summaryParts.push(`${c.name} ✗`);
      } else if (qty > c.defaultQty) {
        const addedCount = qty - c.defaultQty;
        const extraCost = addedCount * c.extraPrice;
        list.push({
          name: c.name,
          change: `+${addedCount} (₹${extraCost})`,
          extraCost,
          status: "extra",
          qty,
        });
        summaryParts.push(`${c.name} +${addedCount}`);
      } else {
        list.push({ name: c.name, change: "Included", extraCost: 0, status: "normal", qty });
      }
    });

    return { list, summary: summaryParts.join(", ") || "Standard Recipe" };
  };

  const onAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please log in to add items to your cart!");
      sessionStorage.setItem("redirectUrl", `/food/${id}`);
      navigate("/signin");
      return;
    }

    const { list: customList, summary } = getCustomizationDetails();

    const cartItemData = {
      productId: product._id,
      id: product._id,
      title: product.title,
      basePrice: product.price,
      itemPrice: unitPrice,
      quantity: itemQuantity,
      img: product.img?.[0] || "",
      category: product.category,
      type: product.type,
      portionSize: supportsHalfFull ? portionSize : null,
      customizations: customList,
      customizationSummary: summary,
      cartItemId: `${product._id}_${portionSize}_${JSON.stringify(customQuantities)}`,
    };

    handleCart(cartItemData);
    toast.success(`Added ${product.title} to cart!`);
  };

  if (loading) {
    return (
      <div className="food-detail-loading">
        <div className="fd-spinner"></div>
        <p className="fd-loading-text">Preparing culinary experience...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="food-detail-error">
        <div className="fd-error-icon">🍽️</div>
        <h2>Item Not Found</h2>
        <p>Sorry, the requested delicacy is currently unavailable.</p>
        <Link to="/ourfood" className="fd-back-btn">
          <FaArrowLeft /> Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="food-detail-page">
      <div className="food-detail-container">
        
        {/* Breadcrumb Navigation */}
        <nav className="fd-breadcrumbs">
          <Link to="/" className="fd-crumb-link">Home</Link>
          <FaChevronRight className="fd-crumb-sep" />
          <Link to="/ourfood" className="fd-crumb-link">Menu</Link>
          <FaChevronRight className="fd-crumb-sep" />
          <Link to={`/ourfood?category=${encodeURIComponent(product.category)}`} className="fd-crumb-link">
            {product.category}
          </Link>
          <FaChevronRight className="fd-crumb-sep" />
          <span className="fd-crumb-active">{product.title}</span>
        </nav>

        {/* Top Hero Banner */}
        <div className="food-detail-hero">
          <div className="hero-image-wrapper">
            <img
              src={product.img?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
              alt={product.title}
              className="hero-image"
            />
            <div className="hero-glow-overlay"></div>
          </div>

          <div className="hero-overlay-content">
            <div className="hero-tags">
              <span className={`fd-badge ${product.type === "veg" ? "badge-veg" : "badge-nonveg"}`}>
                {product.type === "veg" ? "● Pure Veg" : `● Non-Veg (${product.subType || "Meat"})`}
              </span>
              <span className="fd-cat-badge">
                <FaUtensils className="badge-icon" /> {product.category}
              </span>
              <span className="fd-chef-badge">
                <FaFire className="badge-icon fire-icon" /> Freshly Prepared
              </span>
            </div>

            <h1 className="hero-title">{product.title}</h1>

            <div className="hero-meta-row">
              <div className="hero-price-chip">
                <span className="chip-label">Starting From</span>
                <span className="chip-price">₹{product.price}</span>
              </div>
              <div className="hero-feature-chips">
                <span className="feature-chip"><FaClock /> 20-30 mins</span>
                <span className="feature-chip"><FaShieldAlt /> 100% Hygienic</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Interactive Grid */}
        <div className="food-detail-body">
          {/* Left Column: Descriptions, Portions, & Customizations */}
          <div className="detail-info-section">
            
            {/* Story / Description Box */}
            <div className="fd-glass-card fd-desc-card">
              <div className="card-header-bar">
                <h3 className="card-section-title">About this Delicacy</h3>
                <span className="accent-pill">Chef's Recipe</span>
              </div>
              <p className="food-description">
                {product.description || "Crafted with authentic hand-ground spices, simmered to perfection, and served fresh with garnishing."}
              </p>
            </div>

            {/* ── Half / Full Portion Selector ── */}
            {supportsHalfFull && (
              <div className="fd-glass-card portion-selector-card">
                <div className="portion-header">
                  <div className="portion-header-icon-box">
                    <FaUtensils />
                  </div>
                  <div>
                    <h3 className="card-section-title">Select Serving Portion</h3>
                    <p className="section-subtext">Choose the portion size that fits your appetite</p>
                  </div>
                </div>

                <div className="portion-options-grid">
                  <div
                    className={`portion-card ${portionSize === "half" ? "portion-active" : ""}`}
                    onClick={() => setPortionSize("half")}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="portion-card-top">
                      <div className="portion-card-left">
                        <span className="portion-emoji">🥣</span>
                        <div>
                          <h4 className="portion-title">Half Portion</h4>
                          <span className="portion-subtitle">Ideal for 1 person (Light Meal)</span>
                        </div>
                      </div>
                      <div className="portion-radio">
                        {portionSize === "half" && <FaCheck className="radio-check-icon" />}
                      </div>
                    </div>

                    <div className="portion-card-footer">
                      <div className="portion-price-wrap">
                        <span className="portion-price">₹{halfPrice}</span>
                        <span className="portion-discount-tag">Save 40%</span>
                      </div>
                      <span className="portion-selection-status">
                        {portionSize === "half" ? "Selected" : "Tap to Select"}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`portion-card ${portionSize === "full" ? "portion-active" : ""}`}
                    onClick={() => setPortionSize("full")}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="portion-card-top">
                      <div className="portion-card-left">
                        <span className="portion-emoji">🍛</span>
                        <div>
                          <h4 className="portion-title">Full Portion</h4>
                          <span className="portion-subtitle">Generous serving, great value</span>
                        </div>
                      </div>
                      <div className="portion-radio">
                        {portionSize === "full" && <FaCheck className="radio-check-icon" />}
                      </div>
                    </div>

                    <div className="portion-card-footer">
                      <div className="portion-price-wrap">
                        <span className="portion-price">₹{fullPrice}</span>
                        <span className="portion-standard-tag">Full Serving</span>
                      </div>
                      <span className="portion-selection-status">
                        {portionSize === "full" ? "Selected" : "Tap to Select"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Ingredients Breakdown & Customization Box ── */}
            <div className="fd-glass-card customization-card">
              <div className="custom-card-header">
                <div className="custom-header-icon-box">
                  <FaSlidersH />
                </div>
                <div>
                  <h3 className="card-section-title">Customize Ingredients & Add-ons</h3>
                  <p className="section-subtext">Tailor your culinary preferences to your exact taste</p>
                </div>
              </div>

              {product.customizations && product.customizations.length > 0 ? (
                <div className="ingredients-list">
                  {product.customizations.map((item, idx) => {
                    const qty = customQuantities[item.name] ?? item.defaultQty;
                    const isRemoved = qty === 0;
                    const isExtra = qty > item.defaultQty;
                    const emoji = getIngredientEmoji(item.name);

                    return (
                      <div
                        key={idx}
                        className={`ingredient-row ${isRemoved ? "removed-state" : ""} ${isExtra ? "extra-state" : ""}`}
                      >
                        <div className="ingredient-left">
                          <div className="ingredient-avatar">
                            {item.icon ? (
                              <img src={item.icon} alt={item.name} className="ingredient-icon-img" />
                            ) : (
                              <span className="ingredient-emoji">{emoji}</span>
                            )}
                          </div>
                          
                          <div className="ingredient-info">
                            <div className="ingredient-name-row">
                              <span className="ingredient-name">{item.name}</span>
                              {item.removable === false && (
                                <span className="core-badge">Core Ingredient</span>
                              )}
                            </div>

                            <div className="ingredient-status-row">
                              {isRemoved && (
                                <span className="status-pill status-pill-removed">
                                  Removed ✗
                                </span>
                              )}
                              {!isRemoved && !isExtra && (
                                <span className="status-pill status-pill-included">
                                  {item.extraPrice === 0 ? "✓ Included Standard" : "✓ Included Free"}
                                </span>
                              )}
                              {isExtra && (
                                <span className="status-pill status-pill-extra">
                                  +{qty - item.defaultQty} Extra (+₹{(qty - item.defaultQty) * item.extraPrice})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="ingredient-controls">
                          <button
                            className="cust-btn minus"
                            onClick={() => handleCustomQtyChange(item, -1)}
                            disabled={!item.removable && qty <= item.defaultQty}
                            title={!item.removable ? "Required item cannot be removed" : "Decrease quantity"}
                            aria-label="Decrease"
                          >
                            <FaMinus size={11} />
                          </button>
                          
                          <span className={`cust-qty ${isExtra ? "qty-highlight" : ""} ${isRemoved ? "qty-zero" : ""}`}>
                            {qty}
                          </span>

                          <button
                            className="cust-btn plus"
                            onClick={() => handleCustomQtyChange(item, 1)}
                            title={item.extraPrice > 0 ? `+₹${item.extraPrice} per additional portion` : "Add extra"}
                            aria-label="Increase"
                          >
                            <FaPlus size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-customs-box">
                  <FaUtensils className="no-custom-icon" />
                  <p>This specialty dish is crafted strictly following our Chef's signature authentic recipe.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Luxury Order Breakdown */}
          <div className="detail-checkout-wrapper">
            <div className="detail-checkout-card">
              <div className="checkout-card-header">
                <div className="checkout-title-wrap">
                  <FaShoppingBag className="cart-badge-icon" />
                  <h3>Order Summary</h3>
                </div>
                <span className="live-status-dot">Live Pricing</span>
              </div>

              <div className="summary-breakdown">
                <div className="summary-row">
                  <span className="summary-label">Base Item Price</span>
                  <span className="summary-val">₹{product.price}</span>
                </div>

                {supportsHalfFull && (
                  <div className="summary-row portion-calc-row">
                    <span className="summary-label">
                      Portion: {portionSize === "half" ? "🥣 Half (0.6x)" : "🍛 Full (1.0x)"}
                    </span>
                    <span className={portionSize === "half" ? "summary-val discount-green" : "summary-val"}>
                      ₹{portionSize === "half" ? halfPrice : fullPrice}
                    </span>
                  </div>
                )}

                {product.customizations &&
                  product.customizations.map((c, i) => {
                    const qty = customQuantities[c.name] ?? c.defaultQty;
                    if (qty > c.defaultQty) {
                      const extraCost = (qty - c.defaultQty) * c.extraPrice;
                      return (
                        <div key={i} className="summary-row extra-item-row">
                          <span className="summary-label">+ {c.name} ({qty - c.defaultQty} extra)</span>
                          <span className="summary-val">+₹{extraCost}</span>
                        </div>
                      );
                    }
                    if (qty === 0) {
                      return (
                        <div key={i} className="summary-row removed-item-row">
                          <span className="summary-label">– {c.name} (Removed)</span>
                          <span className="summary-val text-muted">₹0</span>
                        </div>
                      );
                    }
                    return null;
                  })}

                <div className="summary-divider"></div>

                <div className="summary-row total-unit-row">
                  <span className="summary-label">Customized Unit Price</span>
                  <span className="summary-val highlight-gold">₹{unitPrice}</span>
                </div>

                {/* Overall Quantity Stepper */}
                <div className="quantity-selector-box">
                  <div className="qty-label-row">
                    <span className="qty-heading">Number of Plates</span>
                    <span className="qty-sub">{itemQuantity} {itemQuantity > 1 ? "Servings" : "Serving"}</span>
                  </div>
                  
                  <div className="item-qty-stepper">
                    <button
                      className="qty-action-btn"
                      onClick={() => setItemQuantity((q) => Math.max(1, q - 1))}
                      disabled={itemQuantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <FaMinus size={13} />
                    </button>
                    <span className="item-qty-display">{itemQuantity}</span>
                    <button
                      className="qty-action-btn"
                      onClick={() => setItemQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                    >
                      <FaPlus size={13} />
                    </button>
                  </div>
                </div>

                <div className="summary-divider"></div>

                {/* Grand Total Row */}
                <div className="grand-total-row">
                  <div>
                    <span className="grand-total-label">Total Amount</span>
                    <span className="grand-total-tax-note">Inclusive of all taxes</span>
                  </div>
                  <span className="grand-total-amount">₹{totalPrice}</span>
                </div>
              </div>

              <button className="add-to-cart-main-btn" onClick={onAddToCart}>
                <FaShoppingBag />
                <span>Add to Cart • ₹{totalPrice}</span>
              </button>

              <div className="guarantee-box">
                <span>🛡️ 100% Fresh & Contactless Delivery Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Items Section */}
        {relatedProducts.length > 0 && (
          <div className="related-items-section">
            <div className="related-section-header">
              <div>
                <span className="related-sub-badge">Explore More</span>
                <h2 className="related-heading">More Delicious Items from {product.category}</h2>
              </div>
              <Link to={`/ourfood?category=${encodeURIComponent(product.category)}`} className="see-all-category-link">
                View All in {product.category} <FaChevronRight size={12} />
              </Link>
            </div>

            <div className="related-grid">
              {relatedProducts.slice(0, 4).map((rel) => (
                <Link to={`/food/${rel._id}`} key={rel._id} className="related-card">
                  <div className="rel-img-wrapper">
                    <img
                      src={rel.img?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                      alt={rel.title}
                      loading="lazy"
                    />
                    <div className="rel-badge-overlay">
                      <span className={`rel-badge ${rel.type === "veg" ? "badge-veg" : "badge-nonveg"}`}>
                        {rel.type === "veg" ? "● Veg" : "● Non-Veg"}
                      </span>
                    </div>
                    <span className="rel-price-tag">₹{rel.price}</span>
                  </div>
                  <div className="rel-card-info">
                    <h4 className="rel-title">{rel.title}</h4>
                    <p className="rel-desc">
                      {rel.description || "Authentic freshly prepared specialty dish with premium ingredients."}
                    </p>
                    <div className="rel-card-action">
                      <span className="rel-view-text">Customize & Order →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FoodDetail;
