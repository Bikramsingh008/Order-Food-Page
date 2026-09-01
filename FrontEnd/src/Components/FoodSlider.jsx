import React, { useRef, useState, useEffect } from "react";
import "./FoodSlider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight, FaPlus, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../utils/api";

const FoodSlider = ({ handleCart }) => {
  const sliderRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 850,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 550,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const getProductsData = async () => {
    try {
      const res = await axios.get(`${API_URL}/product/list`);
      if (res.data.success) {
        setProducts(res.data.products);
      } else {
        toast.error(res.data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  return (
    <section className="yf-slider-section">
      <div className="section-container">
        <div className="yf-slider-header">
          <div>
            <h2 className="section-heading">Featured Chef Specials</h2>
            <p className="section-sub">
              Trending dishes loved by thousands of foodies
            </p>
          </div>
          <div className="yf-slider-nav-arrows">
            <button
              className="yf-slider-arrow-btn"
              onClick={() => sliderRef.current?.slickPrev()}
              aria-label="Previous slide"
            >
              <FaChevronLeft />
            </button>
            <button
              className="yf-slider-arrow-btn"
              onClick={() => sliderRef.current?.slickNext()}
              aria-label="Next slide"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="yf-category-grid">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="skeleton"
                style={{ height: "320px", borderRadius: "16px" }}
              />
            ))}
          </div>
        ) : (
          <Slider ref={sliderRef} {...settings}>
            {products.map((item) => (
              <div key={item._id} className="yf-slider-card">
                <div className="yf-food-card">
                  <div className="yf-food-img-container">
                    <img
                      className="yf-food-img"
                      src={
                        item.img?.[0] ||
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                      }
                      alt={item.title}
                    />
                    <div className="yf-food-badge">
                      {item.type === "non-veg" ? (
                        <span className="badge-nonveg">● Non-Veg</span>
                      ) : (
                        <span className="badge-veg">● Pure Veg</span>
                      )}
                    </div>
                    <span className="yf-food-price-tag">
                      ₹{Number(item.price).toFixed(2)}
                    </span>
                  </div>

                  <div className="yf-food-body">
                    <div>
                      <Link
                        to={`/food/${item._id}`}
                        className="yf-food-title"
                      >
                        {item.title}
                      </Link>
                      <p className="yf-food-desc">
                        {item.description ||
                          "Delicious authentic dish prepared with fresh spices and traditional ingredients."}
                      </p>
                    </div>

                    <div className="yf-food-footer">
                      <button
                        className="yf-add-cart-btn"
                        onClick={() => {
                          handleCart({
                            id: item._id,
                            title: item.title,
                            price: Number(item.price),
                            quantity: 1,
                            img: item.img?.[0],
                          });
                          toast.success(`${item.title} added to cart!`);
                        }}
                      >
                        <FaPlus size={12} /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
};

export default FoodSlider;
