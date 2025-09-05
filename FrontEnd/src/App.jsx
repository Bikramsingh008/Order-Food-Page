import React, { useState } from "react";
import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import OurFood from "./Components/OurFood";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import AboutUs from "./Components/AboutUs";
import Signin from "./Components/Signin";
import Cart from "./Components/Cart";
import Signup from "./Components/SignUp";
import AdminPanel from "./Components/AdminPanel";
import AdminRoute from "./Components/AdminRoute";


function App() {
  const [cartItems, setCartItems] = useState([]);

  // ✅ add to cart
  const handleCart = (item) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, item]);
    }
  };

  // ✅ remove from cart
  const removeFromCart = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
  };

  const updateQuantity = (index, newQuantity) => {
    setCartItems((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[index].quantity = newQuantity;
      return updatedCart;
    });
  };

  return (
    <>
      <BrowserRouter>
        <Header count={cartItems.length} />
        <Routes>
          <Route path="/" element={<Home handleCart={handleCart} />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route
            path="/ourfood"
            element={<OurFood handleCart={handleCart} />}
          />

          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
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
