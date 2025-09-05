import React from "react";
import { Link } from "react-router-dom";  // ✅ import Link

const Footer = () => {
  return (
    <>
      <div style={{
        width: '100%',
        backgroundColor: 'black',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-around',
        fontSize: '25px',
        padding: '20px 0px',
        position: 'relative',
        bottom: '0px',
        top: '250px'
      }}>
        <div>
          <h2>Yummy<span style={{ color: 'rgb(233, 162, 22)' }}>Food</span></h2>
          <p style={{ color: 'grey' }}>2025 Bundl Technologies Pvt. Ltd</p>
        </div>

        <div>
          <h2>Company</h2>
          {/* ✅ use Link instead of p */}
          <Link to="/AboutUs" style={{ color: 'grey', textDecoration: 'none', display: 'block' }}>About</Link>
          <p style={{ color: 'grey' }}>Careers</p>
          <p style={{ color: 'grey' }}>Teams</p>
          <p style={{ color: 'grey' }}>Yummy One</p>
        </div>

        <div>
          <h2>Help & Support</h2>
          <p style={{ color: 'grey' }}>Company</p>
          <p style={{ color: 'grey' }}>Partner with Us</p>
          <p style={{ color: 'grey' }}>Ride with Us</p>
        </div>

        <div>
          <h2>We deliver to:</h2>
          <p style={{ color: 'grey' }}>Banglore</p>
          <p style={{ color: 'grey' }}>Gurgaon</p>
          <p style={{ color: 'grey' }}>Delhi</p>
          <p style={{ color: 'grey' }}>Mumbai</p>
          <p style={{ color: 'grey' }}>Pune</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
