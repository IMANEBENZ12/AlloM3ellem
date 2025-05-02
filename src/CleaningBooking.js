import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "./Navbar.js";
import "./CleaningBooking.css";

const HouseCleaningPage = () => {
  const [zip, setZip] = useState('');
  const [beds, setBeds] = useState(1);
  const [baths, setBaths] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [locationError, setLocationError] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const getLocationAndZip = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          const zipCode = data.address.postcode;
          if (zipCode) {
            setZip(zipCode);
            setLocationError('');
          } else {
            setLocationError('Unable to find ZIP code for your location.');
          }
        } catch (error) {
          console.error(error);
          setLocationError('Error fetching location data.');
        }

        setLoadingLocation(false);
      },
      (error) => {
        console.error(error);
        setLocationError('Permission denied or error retrieving location.');
        setLoadingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save booking data to localStorage or send it to the backend
      localStorage.setItem('cleaningBooking', JSON.stringify({
        zipCode: zip,
        beds: parseInt(beds, 10),
        baths: parseInt(baths, 10),
        date,
        time,
        email,
      }));

      // Navigate to FinalizeCleaning.js
      navigate('/finalize-cleaning');
    } catch (error) {
      console.error('Error submitting booking:', error);
      setMessage('An error occurred while submitting the booking.');
    }
  };

  return (
    <div className="house-cleaning-page">
      <Navbar />
      
      <div className="content-section">
        <h1>House Cleaning</h1>
        {message && (
          <p className={`warning ${message.includes("not") ? "error" : "success"}`}>{message}</p>
        )}
        <p>We offer a variety of cleaning services to meet your needs.</p>

        <form className="cleaning-form" onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="ZIP Code"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={getLocationAndZip}
              className="get-location-button"
              disabled={loadingLocation}
            >
              {loadingLocation ? 'Locating...' : 'Use My Location'}
            </button>
          </div>
          {locationError && <p className="error-text">{locationError}</p>}
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