import React, { useState } from "react";
import Navbar from "./Navbar.js";
//import Footer from "../components/Footer";
import "./CleaningBooking.css";

const casablancaZipCodes = [
  "20000", "20050", "20250", "20300", "20410", "20500",
  "20600", "20700", "20800", "20900", "21000", "21100"
];

const HouseCleaningPage = () => {
  const [zip, setZip] = useState("");
  const [beds, setBeds] = useState("1");
  const [baths, setBaths] = useState("1");
  const [date, setDate] = useState("2025-04-23");
  const [time, setTime] = useState("16:00");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!casablancaZipCodes.includes(zip)) {
      setMessage("Service not available in your area. We currently only serve Casablanca.");
    } else {
      setMessage("Great! We serve your area. A price estimate will be sent to your email soon.");
    }
  };

  return (
    <div className="house-cleaning-page">
      <Navbar />
      <div className="hero-section">
        <img
          src="/images/kitchen-cleaning.jpg"
          alt="Cleaning Service"
          className="hero-image"
        />
      </div>
      <div className="content-section">
        <h1>House Cleaning</h1>
        {message && (
          <p className={`warning ${message.includes("not") ? "error" : "success"}`}>{message}</p>
        )}
        <p className="reviews">⭐ 41,637 Reviews</p>

        <form className="cleaning-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="ZIP Code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            required
          />
          <select value={beds} onChange={(e) => setBeds(e.target.value)}>
            {[...Array(5)].map((_, i) => (
              <option key={i} value={i + 1}>{`${i + 1} beds`}</option>
            ))}
          </select>
          <select value={baths} onChange={(e) => setBaths(e.target.value)}>
            {[...Array(5)].map((_, i) => (
              <option key={i} value={i + 1}>{`${i + 1} baths`}</option>
            ))}
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Get a Price</button>
        </form>
      </div>
     
    </div>
  );
};

export default HouseCleaningPage;