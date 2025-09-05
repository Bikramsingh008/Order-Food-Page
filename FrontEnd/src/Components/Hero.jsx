import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Hero.css'
const Hero = () => {
  const imgData = [
    {
      url: 'https://res.cloudinary.com/ehizeex-shop/image/upload/v1672672076/NetflixApp/burger_emxbtv.jpg',
    },
    {
      url: 'https://res.cloudinary.com/ehizeex-shop/image/upload/v1672672452/NetflixApp/pizza_osjb4f.jpg',
    },
    {
      url: 'https://res.cloudinary.com/ehizeex-shop/image/upload/v1672672612/NetflixApp/ric_a4ewxo.jpg',
    },
  ];

  const[slider, setSlider] = useState(0);

  const handleMinus = () => {
    setSlider(slider == 0 ? 2: slider - 1)
  }
  const handlePlus = () => {
    setSlider(slider == imgData.length - 1? 0 : slider +1)
  }

  useEffect(()=>{

    const sliderClear = setInterval(() => {
      handlePlus();
    },2000)

    return()=> clearInterval(sliderClear)
  }, [slider])
  return (
    <>
      <div>
        <img className='images'
                  src={imgData[slider].url}
                  alt="food"
                  style={{ width:'170vh', height:'80vh', padding:'20px 20px 0px 200px',position:'relative', top:'40px',right:'72px'}}/>
        </div>
        <div style={{backgroundColor:"black",height:'90vh', position:'absolute',bottom:'56px', left:'205px', opacity:'50%'}}></div>

        <div >
        <p style={{width:'170vh',height:'35px',position:'absolute', top:'147vh', left:'25px', fontSize:'50px',textAlign:'center', color:'white'}}>Welcome to the World of Tasty & Fresh Food</p>
        </div>
        <div style={{fontSize:'30px', cursor:'pointer',display:'flex', justifyContent:'center', gap:'137vh', position:'absolute', top:'50%',color:'white', left:'130px'}}>
          <FaChevronLeft onClick={handleMinus}/>
          <FaChevronRight onClick={handlePlus}/>
          </div>
    </>
  );
};

export default Hero;
