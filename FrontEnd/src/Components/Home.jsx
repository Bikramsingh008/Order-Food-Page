import React from "react";
import Hero from "./Hero";
import Delivery from "./Delivery";
import FoodSlider from "./FoodSlider";

const Home = ({ handleCart }) => {
  return (
    <>
      <Delivery />
      <Hero />
      <FoodSlider handleCart={handleCart} />
    </>
  );
};

export default Home;
