import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, CalendarCheck, HeartHandshake } from "lucide-react";
import "./Home.css";
import LocationSearch from "./LocationSearch";

const HomePage = () => {
    const [selectedLocation, setSelectedLocation] = useState(null);
  
    const handleLocationSelect = (location) => {
      console.log("User selected:", location);
      setSelectedLocation(location);
      // You can redirect or fetch service providers here
    };

  return (
    <div className="homepage">
      {/* Navbar */}
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

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1>Book top-rated home services</h1>
          <p>Plumber, Electrician, cleaner and more.</p>
          <div className="search-container">
  <LocationSearch onSelect={handleLocationSelect} />
  {selectedLocation && <p>Selected Location: {selectedLocation}</p>}
</div>
        </div>
      </header>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How it works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Select a service</h3>
            <p>Choose what you need from our list of trusted services.</p>
          </div>
          <div className="step">
            <h3>2. Pick a time</h3>
            <p>Choose a time that works for you. Pros are available 7 days a week.</p>
          </div>
          <div className="step">
            <h3>3. Your pro arrives</h3>
            <p>A vetted professional will show up and get the job done right.</p>
          </div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="promo">
        <h2>Why choose us?</h2>
        <div className="benefits-section">
          

          <div className="benefit-item">
            <div className="benefit-icon">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3>Vetted and screened professionals</h3>
          </div>

          <div className="benefit-item">
            <div className="benefit-icon">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <h3>Next-day availability</h3>
          </div>

          <div className="benefit-item">
            <div className="benefit-icon">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <h3>Backed by the Handy Happiness Guarantee</h3>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 ALLOM3ELEM. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;