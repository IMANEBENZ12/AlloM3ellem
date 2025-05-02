// Booking.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Booking.css';
import { useTranslation } from 'react-i18next';
import Navbar from "./Navbar.js";
import { Clock, CheckSquare, MessageSquare } from 'lucide-react';

const Booking = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    ZipCode: '',
    jobDescription: '',
    hours: '',
    date: '',
    time: '',
    email: '',
    phone: ''
  });
  const [locationError, setLocationError] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const getLocationAndZip = () => {
    if (!navigator.geolocation) {
      setLocationError(t('geolocationNotSupported'));
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
  
          const zip = data.address.postcode;
          const city = data.address.city || data.address.town || data.address.village;
  
          if (zip) {
            setFormData(prev => ({
              ...prev,
              ZipCode: zip
            }));
            setLocationError('');
          } else {
            setLocationError(t('zipCodeNotFound'));
          }
        } catch (error) {
          console.error(error);
          setLocationError(t('errorFetchingZip'));
        }
  
        setLoadingLocation(false);
      },
      (error) => {
        console.error(error);
        setLocationError(t('locationPermissionDenied'));
        setLoadingLocation(false);
      }
    );
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem('pendingBooking', JSON.stringify({
      zipCode: formData.ZipCode,
      jobDescription: formData.jobDescription,
      hours: parseInt(formData.hours, 10),
      date: formData.date,
      time: formData.time,
      email: formData.email,
      phone: formData.phone
    }));
    
    navigate('/finalize');
  };

  const hourOptions = ['1 hour', '2 hours', '3 hours', '4 hours', '5+ hours'];
  const timeOptions = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  return (
    <div className="booking-container">
      <Navbar />
      <div className="booking-content">
        <div className="service-details">
          <h1>{t("electricalService")}</h1>
          
          <p className="service-description">
            {t("serviceDescription")}
          </p>
          
          <ul className="benefits-list">
            <li>
              <CheckSquare className="check-icon" />
              <span>{t("vettedProfessionals")} <a href="#" className="link">{t("screenedProfessionals")}</a>.</span>
            </li>
            <li>
              <CheckSquare className="check-icon" />
              <span>{t("friendlyCustomerService")}</span>
            </li>
            <li>
              <CheckSquare className="check-icon" />
              <span>{t("backedBy")} <a href="#" className="link">{t("happinessGuarantee")}</a>.</span>
            </li>
            <li>
              <CheckSquare className="check-icon" />
              <span>{t("affordablePricing")}</span>
            </li>
            <li>
              <CheckSquare className="check-icon" />
              <span>{t("noTimeWindows")}</span>
            </li>
          </ul>
        </div>
        
        <div className="booking-form-container">
          <h2>{t("electricalService")}</h2>
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label>{t("enterZipCode")}</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  name="ZipCode"
                  value={formData.ZipCode}
                  onChange={handleChange}
                  placeholder={t("enterZipCode")}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  onClick={getLocationAndZip}
                  className="get-location-button"
                  disabled={loadingLocation}
                >
                  {loadingLocation ? t("locating") : t("useMyLocation")}
                </button>
              </div>
              {locationError && <p className="error-text">{locationError}</p>}
            </div>
            
            <div className="form-group">
              <label>{t("jobDescriptionLabel")}</label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                placeholder={t("jobDescriptionPlaceholder")}
                className="form-textarea"
                required
              ></textarea>
            </div>
            
            <div className="form-group">
              <label>{t("hoursToBook")}</label>
              <select
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="1">1 {t("Hour")}</option>
                <option value="2">2 {t("Hours")}</option>
                <option value="3">3 {t("Hours")}</option>
                <option value="4">4 {t("Hours")}</option>
                <option value="5">5+ {t("Hours")}</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>{t("proArrivalTime")}</label>
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
                placeholder={t("emailPlaceholder")}
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
                placeholder={t("phonePlaceholder")}
                className="form-input"
              />
            </div>
            
            <button type="submit" className="get-price-button">{t("getPriceButton")}</button>
          </form>
        </div>
      </div>
      
      <div className="how-it-works">
        <h2>{t("howItWorksTitle")}</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-icon">
              <Clock size={40} />
            </div>
            <p>{t("pickATime")}</p>
            <p>{t("pickATimeDescription")}</p>
          </div>
          
          <div className="step">
            <div className="step-icon">
              <MessageSquare size={40} />
            </div>
            <p>{t("bookInstantly")}</p>
          </div>
          
          <div className="step">
            <div className="step-icon">
              <div className="pro-icon"></div>
            </div>
            <p>{t("yourProArrives")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;