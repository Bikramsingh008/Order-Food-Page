import React from "react";
import Hero from "./Hero";
import CategoryBar from "./CategoryBar";
import FoodSlider from "./FoodSlider";
import WhyUs from "./WhyUs";

const Home = ({ handleCart }) => {
  return (
    <>
      <Hero />
      <CategoryBar />
      <FoodSlider handleCart={handleCart} />
      <WhyUs />
    </>
  );
};

export default Home;
