import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="images/service-a-domicile.png" alt="Logo" className="logo-img" />
      </div>
      <div className="nav-buttons">
        <Link to="/home" className="nav-btn">Home</Link>
        <Link to="/services" className="nav-btn">Services</Link>
        <Link to="/apply" className="nav-btn">Become a Pro</Link>
        <Link to="/login" className="login-btn">Log in</Link>
      </div>
    </nav>
  );
};

export default Navbar;