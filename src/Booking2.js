// Booking.js
import React, { useState } from 'react';
import './Booking.css';
import Navbar from "./Navbar.js";
import { Clock, CheckSquare, MessageSquare } from 'lucide-react';

const Booking = () => {
  const [formData, setFormData] = useState({
    location: '',
    jobDescription: '',
    hours: '',
    date: '',
    time: '',
    email: '',
    phone: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking submitted:', formData);
    // Handle submission logic here
  };
  
  // Options for dropdowns
  const hourOptions = ['1 hour', '2 hours', '3 hours', '4 hours', '5+ hours'];
  const timeOptions = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
  
  return (
    <div className="booking-container">
      <Navbar />
      <div className="booking-content">
        <div className="service-details">
          <h1>Electrical Service</h1>
          
          <p className="service-description">
            When you have an electrical issue that needs professional attention, look no further than AlloM3ellem. 
            Whether it's a faulty wiring issue, light fixture replacement, or any other electrical need, our 
            professionals are here to help. Book electricians through the AlloM3ellem platform to ensure safe, 
            reliable, and affordable service.
          </p>
          
          <ul className="benefits-list">
            <li>
              <CheckSquare className="check-icon" />
              <span>Vetted and <a href="#" className="link">screened professionals</a>.</span>
            </li>
            <li>
              <CheckSquare className="check-icon" />
              <span>Friendly 24/7 customer service.</span>
            </li>
            <li>
              <CheckSquare className="check-icon" />
              <span>Backed by the <a href="#" className="link">Handy Happiness Guarantee</a>.</span>
            </li>
            <li>
              <CheckSquare className="check-icon" />
              <span>Affordable, upfront pricing.</span>
            </li>
            <li>
              <CheckSquare className="check-icon" />
              <span>No time windows, book when you want.</span>
            </li>
          </ul>
        </div>
        
        <div className="booking-form-container">
          <h2>Electrical Service</h2>
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Tell us about the job</label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                placeholder="Please describe the job in detail. (required)"
                className="form-textarea"
                required
              ></textarea>
            </div>
            
            <div className="form-group">
              <label>How many hours would you like to book?</label>
              <select
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                className="form-select"
                required
              >
                {hourOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>When would you like a Pro to come?</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="form-select"
                required
              >
                {timeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number (Optional)"
                className="form-input"
              />
            </div>
            
            <button type="submit" className="get-price-button">Get a Price</button>
          </form>
        </div>
      </div>
      
      <div className="how-it-works">
        <h2>How AlloM3ellem Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-icon">
              <Clock size={40} />
            </div>
            <p>Pick a Time</p>
            <p>Select the day and time for your service and get instant, affordable pricing.</p>
          </div>
          
          <div className="step">
            <div className="step-icon">
              <MessageSquare size={40} />
            </div>
            <p>Book instantly</p>
          </div>
          
          <div className="step">
            <div className="step-icon">
              <div className="pro-icon"></div>
            </div>
            <p>Your pro arrives</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;