import React from "react";
import { Link } from "react-router-dom";
import "./Services.css";

const serviceData = [
  {
    title: "Home Cleaning",
    description: "Experienced, background-checked professionals to clean your home.",
    image: "/images/cleaning.png"
  },
  {
    title: "Electrical Help",
    description: "Light fixture replacement, wiring issues, and other electric needs.",
    image: "/images/electritian.png"
  },
  {
    title: "Plumbing Help",
    description: "Get help with lifting and moving your belongings.",
    image: "/images/plumb.jpg"
  }
];

const ServicesPage = () => {
  return (
    <div className="services-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <img src="images/service-a-domicile.png" alt="Logo" className="logo-img" />
        </div>
        <div className="nav-buttons">
          <Link to="/home" className="nav-btn">Home</Link>
          <Link to="/services" className="nav-btn">Services</Link>
          <button className="nav-btn">Become a Pro</button>
          <Link to="/login" className="login-btn">Log in</Link>
        </div>
      </nav>

      <h1>Book a service</h1>
      <p className="subtitle">Top-rated professionals for any home project</p>
      <div className="services-list">
        {serviceData.map((service, index) => (
          <div className="service-card" key={index}>
            <img src={service.image} className="service-image" alt={service.title} />
            <h2>{service.title}</h2>
            <p>{service.description}</p>
            {service.title === "Home Cleaning" ? (
              <Link to="/cleaning-booking" className="book-now-btn">
                Book now
              </Link>
            ) : service.title === "Plumbing Help" ? (
              <Link to="/booking" className="book-now-btn">
                Book now
              </Link>
            ) : service.title === "Electrical Help" ? (
              <Link to="/electrical-booking" className="book-now-btn">
                Book now
              </Link>
            ) : (
              <button className="book-now-btn">Book now</button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 ALLOM3ELEM. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ServicesPage;