import React, { useRef, useState, useEffect } from "react";
import "./FoodSlider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
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
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };

  // fetch products from backend
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
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  const handleSlideLeft = () => {
    sliderRef.current.slickPrev();
  };

  const handleSlideRight = () => {
    sliderRef.current.slickNext();
  };

  return (
    <div className="food-slider-wrapper">
      <h1 className="food-slider-title">What's on your Mind?</h1>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading products...</p>
      ) : (
        <div className="food-slider-container">
          <Slider ref={sliderRef} {...settings}>
            {products.map((item) => (
              <div key={item._id} className="food-slide-card">
                <img
                  className="food-slide-image"
                  src={item.img[0]} // ✅ show first uploaded image
                  alt={item.title}
                />
                <p className="food-slide-title">
                  <b>{item.title}</b>
                </p>
                <p className="food-slide-price">
                  <b>₹{Number(item.price).toFixed(2)}</b>
                </p>
                {/* ✅ Add to cart works same as OurFood */}
                <button
                  className="food-slide-button"
                  onClick={() => {
                    handleCart({
                      id: item._id,
                      title: item.title,
                      price: Number(item.price),
                      quantity: 1,
                    });
                    toast.success(`${item.title} added to cart!`);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </Slider>

          {/* Arrows */}
          <div className="food-slider-arrow left" onClick={handleSlideLeft}>
            <FaChevronLeft />
          </div>
          <div className="food-slider-arrow right" onClick={handleSlideRight}>
            <FaChevronRight />
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodSlider;
