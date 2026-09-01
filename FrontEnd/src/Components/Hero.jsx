import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaChevronLeft, FaChevronRight, FaPlay } from "react-icons/fa";
import "./Hero.css";

const SLIDES = [
  {
    bg: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=80",
    tag: "Burgers & Snacks",
    highlight: "Grilled to",
    main: "Perfection",
  },
  {
    bg: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1600&q=80",
    tag: "Biryanis & Rice",
    highlight: "Royal Flavors,",
    main: "Delivered Hot",
  },
  {
    bg: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1600&q=80",
    tag: "Indian Curries",
    highlight: "Rich, Creamy &",
    main: "Irresistible",
  },
  {
    bg: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=1600&q=80",
    tag: "Drinks & Lassi",
    highlight: "Cool Down",
    main: "& Refresh",
  },
];

const FEATURES = [
  { icon: "⚡", title: "30-Min Delivery", desc: "Hot food at your doorstep in 30 minutes" },
  { icon: "🍽️", title: "57+ Dishes", desc: "Handcrafted Indian & fusion recipes" },
  { icon: "🌿", title: "Fresh Ingredients", desc: "Sourced daily from local farms" },
  { icon: "🔒", title: "Safe & Hygienic", desc: "FSSAI certified kitchen standards" },
];

const Hero = () => {
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const next = useCallback(
    () => setActive((p) => (p + 1) % SLIDES.length),
    []
  );
  const prev = () => setActive((p) => (p === 0 ? SLIDES.length - 1 : p - 1));

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/ourfood?search=${encodeURIComponent(query)}`);
    else navigate("/ourfood");
  };

  const slide = SLIDES[active];

  return (
    <section className="yf-hero">
      {/* Background slides */}
      <div className="yf-hero-bg">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`yf-hero-slide ${i === active ? "active" : ""}`}
            style={{ backgroundImage: `url(${s.bg})` }}
          />
        ))}
      </div>

      {/* Overlays */}
      <div className="yf-hero-overlay" />
      <div className="yf-hero-bottom-fade" />

      {/* Main content */}
      <div className="yf-hero-content">
        {/* Left text */}
        <div className="yf-hero-left">
          {/* Eyebrow */}
          <div className="yf-hero-eyebrow">
            <span className="yf-hero-eyebrow-dot" />
            {slide.tag}
          </div>

          {/* Title */}
          <h1 className="yf-hero-title" key={active}>
            {slide.highlight}{" "}
            <span>{slide.main}</span>
            <br />
            <span style={{ fontSize: "0.6em", color: "rgba(255,255,255,0.7)", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
              — Order Your Favorite Food
            </span>
          </h1>

          {/* Subtitle */}
          <p className="yf-hero-subtitle">
            From spicy biryanis to creamy lassis — explore 57+ handcrafted
            dishes made with fresh ingredients and delivered hot to your door.
          </p>

          {/* Search bar */}
          <form className="yf-hero-search" onSubmit={handleSearch}>
            <FaSearch className="yf-hero-search-icon" />
            <input
              type="text"
              placeholder="Search biryani, burger, chai..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="yf-hero-search-btn">
              Search
            </button>
          </form>

          {/* CTA buttons */}
          <div className="yf-hero-ctas">
            <Link to="/ourfood" className="brand-btn">
              🍽️ &nbsp;Explore Menu
            </Link>
            <Link to="/aboutus" className="brand-btn-outline">
              <FaPlay size={10} />
              Our Story
            </Link>
          </div>

          {/* Stats */}
          <div className="yf-hero-stats">
            {[
              { num: "57+", label: "Menu Items" },
              { num: "4.9★", label: "Avg Rating" },
              { num: "30 min", label: "Delivery" },
              { num: "5 Cities", label: "We Serve" },
            ].map((s) => (
              <div className="yf-hero-stat" key={s.label}>
                <span className="yf-hero-stat-num">{s.num}</span>
                <span className="yf-hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right feature cards */}
        <div className="yf-hero-right">
          {FEATURES.map((f) => (
            <div className="yf-hero-feat-card" key={f.title}>
              <div className="yf-hero-feat-icon">{f.icon}</div>
              <div className="yf-hero-feat-title">{f.title}</div>
              <div className="yf-hero-feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide dots */}
      <div className="yf-hero-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`yf-hero-dot ${i === active ? "active" : ""}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>

      {/* Prev/Next arrows */}
      <div className="yf-hero-arrows">
        <button className="yf-hero-arrow" onClick={prev}>
          <FaChevronLeft />
        </button>
        <button className="yf-hero-arrow" onClick={next}>
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default Hero;
