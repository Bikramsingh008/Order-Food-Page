import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import OurFood from "./Components/OurFood";
import FoodDetail from "./Components/FoodDetail";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import AboutUs from "./Components/AboutUs";
import Signin from "./Components/Signin";
import Cart from "./Components/Cart";
import Signup from "./Components/Signup";
import AdminPanel from "./Components/AdminPanel";
import AdminRoute from "./Components/AdminRoute";
import UserProfile from "./Components/UserProfile";
import MyOrders from "./Components/MyOrders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("yummy_cart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("yummy_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add itemized product to cart
  const handleCart = (newItem) => {
    setCartItems((prevCart) => {
      const itemKey = newItem.cartItemId || `${newItem.id}_${newItem.itemPrice}`;
      const existingIndex = prevCart.findIndex(
        (ci) => (ci.cartItemId || `${ci.id}_${ci.itemPrice}`) === itemKey
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      } else {
        return [...prevCart, newItem];
      }
    });
  };

  // Remove from cart
  const removeFromCart = (index) => {
    setCartItems((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  // Update item quantity
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prevCart) => {
      const updated = [...prevCart];
      updated[index].quantity = newQuantity;
      return updated;
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <Header count={cartItems.reduce((acc, item) => acc + item.quantity, 0)} />
        <Routes>
          <Route path="/" element={<Home handleCart={handleCart} />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route
            path="/ourfood"
            element={<OurFood handleCart={handleCart} />}
          />
          <Route
            path="/food/:id"
            element={<FoodDetail handleCart={handleCart} />}
          />

          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
                handleCart={handleCart}
              />
            }
          />
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
