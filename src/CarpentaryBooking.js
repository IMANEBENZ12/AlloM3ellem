// CarpentryBooking.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useTranslation } from 'react-i18next'; // Import useTranslation
import './Booking.css';
import Navbar from "./Navbar.js";
import { Clock, CheckSquare, MessageSquare } from 'lucide-react';

const CarpentryBooking = () => {
  const { t } = useTranslation(); // Initialize translation
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
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

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

          const zip = data.address.postcode;
          const city = data.address.city || data.address.town || data.address.village;

          if (zip) {
            setFormData(prev => ({
              ...prev,
              ZipCode: zip
            }));
            setLocationError('');
          } else {
            setLocationError('ZIP code not found for your location.');
          }
        } catch (error) {
          console.error(error);
          setLocationError('Error fetching ZIP code from OpenStreetMap.');
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
    localStorage.setItem('pendingBooking', JSON.stringify({
      zipCode: formData.ZipCode,
      jobDescription: formData.jobDescription,
      hours: parseInt(formData.hours, 10),
      date: formData.date,
      time: formData.time,
      email: formData.email,
      phone: formData.phone
    }));

    navigate('/finalize-carpentry');
  };

  // Options for dropdowns
  const hourOptions = ['1 hour', '2 hours', '3 hours', '4 hours', '5+ hours'];
  const timeOptions = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];

  return (
    <div className="booking-container">
      <Navbar />
      <div className="booking-content">
        <div className="service-details">
          <h1>{t("CarpentryService")}</h1>
          <p className="service-description">{t("CarpentaryserviceDescription")}</p>
          <ul className="benefits-list">
            <li>
              <CheckSquare className="check-icon" />
              <span>{t("vettedProfessionals")}</span>
            </li>
            <li>
              <CheckSquare className="check-icon" />
              <span>{t("friendlySupport")}</span>
            </li>
            <li>
              <CheckSquare className="check-icon" />
              <span>{t("happinessGuarantee")}</span>
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
          <h2>{t("CarpentryService")}</h2>
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
              <label>{t("jobDescription")}</label>
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
                {hourOptions.map((option, index) => (
                  <option key={index} value={index + 1}>{option}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{t("whenToCome")}</label>
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
              <label>{t("emailAddress")}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("emailAddress")}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>{t("phoneNumber")}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t("phoneNumber")}
                className="form-input"
              />
            </div>

            <button type="submit" className="get-price-button">{t("getPrice")}</button>
          </form>
        </div>
      </div>

      <div className="how-it-works">
        <h2>{t("howItWorks")}</h2>
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

export default CarpentryBooking;