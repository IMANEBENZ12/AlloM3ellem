// Apply.js
import React, { useState } from 'react';
import './Apply.css';
import Navbar from "./Navbar.js";
import { Search, Calendar, PiggyBank } from 'lucide-react';


const Apply = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    profession: ''
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
    console.log('Form submitted:', formData);
    // Handle submission logic here
  };
  
  const locationOptions = ['Casablanca', 'Rabat', 'Ifrane', 'Marrakech', 'Agadir'];
  const professionOptions = ['Electrician', 'Plumber', 'Cleaner'];
  
  return (
    <div className="apply-container">
      <Navbar />
      <header className="apply-header">
        <h1>Grow your business with ALLOM3ELLEM Services.</h1>
        <p className="header-subtitle">
          Access hundreds of local jobs with no commitment! Claim the jobs you want to build your own schedule.
        </p>
      </header>
      
      <div className="application-form-container">
        <form onSubmit={handleSubmit} className="application-form">
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
            <input
  type="tel"
  name="phoneNumber"
  value={formData.phoneNumber}
  onChange={handleChange}
  placeholder="Phone Number"
  className="form-input phone-input"
  required
/>
            </div>
            <div className="form-group">
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-select"
                required
              >
                {locationOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group full-width">
              <select
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className="form-select"
                required
              >
                {professionOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button type="submit" className="submit-button">Get Started</button>
        </form>
        
        <div className="check-status">
          <p>Already applied? <a href="#check-status">Check your application status here.</a></p>
        </div>
      </div>
      
      <div className="benefits-section">
        <div className="benefit-item">
          <div className="benefit-icon">
            <Search size={48} className="icon" />
          </div>
          <h3>Start with no commitment.</h3>
          <p>Explore jobs near you. You're only responsible when you claim one.</p>
        </div>
        
        <div className="benefit-item">
          <div className="benefit-icon">
            <Calendar size={48} className="icon" />
          </div>
          <h3>Choose your schedule.</h3>
          <p>Decide when you want to work and how often. It's up to you.</p>
        </div>
        
        <div className="benefit-item">
          <div className="benefit-icon">
            <PiggyBank size={48} className="icon" />
          </div>
          <h3>Get upfront pricing.</h3>
          <p>See prices customers are paying for jobs before you claim them. Get potential loyalty rewards, too.</p>
        </div>
      </div>
      
      <div className="testimonial-section">
        <h2>Pros like YOU are winning with ALLOM3ELEM.</h2>
        <div className="testimonial">
          <p>
          "Work when you want. Get paid fast. No chasing clients or payments we handle it all. Sign up now!"
          </p>
          <div className="testimonial-author">
          <div className="testimonial-author">
  <img
    src="/images/ME.jpeg" // Path to the image in the public folder
    alt="Author"
    className="author-image"
    style={{
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      backgroundColor: "#ddd",
      marginRight: "15px",
      objectFit: "cover",
    }}
  />
  
</div>
            <div className="author-info">
              <h4>Imane Ben Zerraouia</h4>
              <p>CEO, AlloM3ellem</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apply;