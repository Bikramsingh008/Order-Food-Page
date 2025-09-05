import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./OurFood.css";
import { API_URL } from "../utils/api";

const OurFood = ({ handleCart }) => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  const getProductsData = async () => {
    try {
      const res = await axios.get(`${API_URL}/product/list`);
      console.log("Response from backend:", res.data);

      if (res.data.success) {
        setProducts(res.data.products); // ✅ correct place to set products
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

  // Increase quantity
  const increaseQty = (id) => {
    const newQty = (quantities[id] || 1) + 1;
    setQuantities({ ...quantities, [id]: newQty });
  };

  // Decrease quantity
  const decreaseQty = (id) => {
    if ((quantities[id] || 1) > 1) {
      const newQty = (quantities[id] || 1) - 1;
      setQuantities({ ...quantities, [id]: newQty });
    }
  };

  return (
    <>
      <div className="menu-title">
        <b>Yum Board</b>
      </div>

      <div className="food-grid">
        {loading && <p>Loading products...</p>}
        {!loading && products.length === 0 && <p>No products found.</p>}

        {products.map((item) => (
          <div key={item._id} className="food-item">
            {/* ✅ Use first image from array */}
            <img src={item.img[0]} alt={item.title} className="food-image" />
            <p className="food-title">
              <b>{item.title}</b>
            </p>
            <p className="food-price">
              <b>₹{item.price}</b>
            </p>

            {/* Quantity buttons */}
            <div className="quantity-container">
              <button
                className="qty-btn"
                onClick={() => decreaseQty(item._id)}
                disabled={(quantities[item._id] || 1) <= 1}
              >
                –
              </button>
              <span className="qty-value">{quantities[item._id] || 1}</span>
              <button className="qty-btn" onClick={() => increaseQty(item._id)}>
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              className="foodCart"
              onClick={() => {
                handleCart({
                  id: item._id,
                  title: item.title,
                  price: item.price,
                  quantity: quantities[item._id] || 1,
                });
                toast.success(`${item.title} added to cart!`);
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default OurFood;
