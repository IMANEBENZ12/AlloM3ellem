
import React from "react";
import { Link } from "react-router-dom"; // Added Link
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo"> <img src="/service-a-domicile.png" alt="Logo" className="logo-img" /> </div>
        <div className="nav-buttons">
          <button className="nav-btn">Home</button>
          <button className="nav-btn">All services</button>
          <button className="nav-btn">English ⬇</button>
          <button className="nav-btn">Download app</button>
        </div>
        <Link to="/signup" className="login-btn">Log in</Link>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h1>Your All-In-One Service Booking Platform</h1>
        <div className="search-container">
          <input type="text" placeholder="Current location" />
          <input type="text" placeholder="Find your service here..." />
          <button className="search-btn">Search</button>
        </div>
      </header>
      {/* How It Works Section */}
     {/* How It Works */}
     <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How Allom3elem Works</h2>
          <div className="flex flex-col md:flex-row justify-between max-w-4xl mx-auto">
            <div className="flex-1 text-center px-4 mb-8 md:mb-0">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Choose a Service</h3>
              <p className="text-gray-600">Browse through our selection of home services</p>
            </div>
            <div className="flex-1 text-center px-4 mb-8 md:mb-0">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Book a Professional</h3>
              <p className="text-gray-600">Select a time and date that works for you</p>
            </div>
            <div className="flex-1 text-center px-4">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Get It Done</h3>
              <p className="text-gray-600">Your pro arrives and completes the job</p>
            </div>
          </div>
        </div>
      </section>
      {/* Promotions Section */}
      <section className="promotions">
        <h2>Promotion for today</h2>
        <div className="promo-cards">
          <div className="promo-card">
            <img src="images/plumber.png" alt="Worker 1" />
            <h3>#PromoToday</h3>
            <p>Work with our best service provider</p>
            <button>Book Now</button>
          </div>
          <div className="promo-card">
            <img src="worker2.jpg" alt="Worker 2" />
            <h3>#PromoToday</h3>
            <p>Work with our best service provider</p>
            <button>Book Now</button>
          </div>
          <div className="promo-card">
            <img src="worker3.jpg" alt="Worker 3" />
            <h3>#PromoToday</h3>
            <p>Work with our best service provider</p>
            <button>Book Now</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
