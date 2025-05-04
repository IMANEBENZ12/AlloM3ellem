import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Finalize.css';
import Navbar from "./Navbar.js";
import { Plus, Minus, Check, Shield, Star, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Finalize = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // State to track which step of the process we're on
  const [currentStep, setCurrentStep] = useState('contact');
  
  // State to track expanded FAQ items
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  // State for booking details fetched from the backend
  const [bookingDetails, setBookingDetails] = useState(null);
  
  // State for matched handymen
  const [matchedHandymen, setMatchedHandymen] = useState([]);
  
  // State for selected handyman
  const [selectedHandyman, setSelectedHandyman] = useState(null);
  
  // State for loading status
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    region: '',
    city: '',
    zipCode: '',
    creditCardNumber: '',
    expiryDate: '',
    cvc: '',
    promoCode: '',
    termsAccepted: false,
    paymentMethod: 'credit', // 'credit' or 'cash'
    handymanId: '' // ID of the selected handyman
  });

  // Helper function to extract hours from booking details
  const getHoursFromBooking = (booking) => {
    if (!booking || !booking.hours) return 1;
    
    // If hours is in format "X hours", extract the number
    if (typeof booking.hours === 'string' && booking.hours.includes('hour')) {
      const match = booking.hours.match(/(\d+)/);
      return match ? parseInt(match[0], 10) : 1;
    }
    
    // If hours is already a number or a string that can be parsed as a number
    return parseInt(booking.hours, 10) || 1;
  };

  // Calculate price based on hours
  const calculatePrice = (hours) => {
    const hourCount = getHoursFromBooking({ hours });
    const pricePerHour = 100; // 100 DH per hour
    return hourCount * pricePerHour;
  };
  useEffect(() => {
    // Retrieve the ZIP code from localStorage and set it in the form data
    const savedZipCode = localStorage.getItem('zipCode');
    if (savedZipCode) {
      setFormData((prev) => ({
        ...prev,
        zipCode: savedZipCode
      }));
    }
  }, []);

  // Fetch booking details from the backend
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bookings/latest');
        if (!response.ok) {
          throw new Error(t('loadingBookingDetails'));
        }
        const data = await response.json();
        console.log('Fetched booking details:', data);
        setBookingDetails(data);
      } catch (error) {
        console.error(t('loadingBookingDetails'), error);
      }
    };

    fetchBookingDetails();
  }, [t]);

  // Fetch matched handymen when zipCode changes
  useEffect(() => {
    const fetchMatchedHandymen = async () => {
      if (!formData.zipCode || formData.zipCode.length < 5) return;

      setIsLoading(true);
      try {
        const serviceType = bookingDetails?.serviceType || 'electrical'; // Default to electrical service
        const response = await fetch(`http://localhost:5000/api/handymen/match/${formData.zipCode}/electrical`);

        if (!response.ok) {
          throw new Error(t('loadingHandymen'));
        }

        const data = await response.json();

        // Filter handymen to include only those with electrical skills
        const filteredHandymen = data.filter(handyman => handyman.skills.includes('electrical'));
        console.log('Filtered handymen:', filteredHandymen);

        setMatchedHandymen(filteredHandymen);

        // Auto-select the first handyman (best match)
        if (filteredHandymen.length > 0 && !selectedHandyman) {
          setSelectedHandyman(filteredHandymen[0]);
          setFormData(prev => ({ ...prev, handymanId: filteredHandymen[0]._id }));
        }
      } catch (error) {
        console.error(t('loadingHandymen'), error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchedHandymen();
  }, [formData.zipCode, bookingDetails?.serviceType, t]);

  // Regions and cities in Morocco
  const regions = [
    "Casablanca-Settat",
    "Rabat-Salé-Kénitra",
    "Marrakech-Safi",
    "Fès-Meknès",
    "Tanger-Tétouan-Al Hoceïma",
    "Souss-Massa",
    "Béni Mellal-Khénifra",
    "Oriental",
    "Drâa-Tafilalet",
    "Guelmim-Oued Noun",
    "Laâyoune-Sakia El Hamra",
    "Dakhla-Oued Ed-Dahab"
  ];
  const citiesByRegion = {
    "Casablanca-Settat": ["Casablanca", "Settat", "Mohammedia", "El Jadida"],
    "Rabat-Salé-Kénitra": ["Rabat", "Salé", "Kénitra", "Témara"],
    "Marrakech-Safi": ["Marrakech", "Safi", "Essaouira"],
    "Fès-Meknès": ["Fès", "Meknès", "Ifrane"],
    "Tanger-Tétouan-Al Hoceïma": ["Tanger", "Tétouan", "Al Hoceïma"],
    "Souss-Massa": ["Agadir", "Taroudant", "Tiznit"],
    "Béni Mellal-Khénifra": ["Béni Mellal", "Khénifra", "Fquih Ben Salah"],
    "Oriental": ["Oujda", "Nador", "Berkane"],
    "Drâa-Tafilalet": ["Errachidia", "Ouarzazate", "Zagora"],
    "Guelmim-Oued Noun": ["Guelmim", "Tan-Tan", "Sidi Ifni"],
    "Laâyoune-Sakia El Hamra": ["Laâyoune", "Boujdour"],
    "Dakhla-Oued Ed-Dahab": ["Dakhla"]
  };
  
  // FAQ items with answers
  const faqItems = [
    // ... existing FAQ items with translated questions and answers ...
  ];
  
  // Handler for input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handler for region change
  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      region: selectedRegion,
      city: "" // Reset city when region changes
    }));
  };
  
  // Handler for city change
  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      city: selectedCity
    }));
  };

  // Handler for handyman selection
  const handleHandymanSelect = (handyman) => {
    console.log(t('selectedHandyman'), handyman);
    setSelectedHandyman(handyman);
    setFormData(prev => ({ ...prev, handymanId: handyman._id }));
  };
  
  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep === 'contact') {
      setCurrentStep('booking');
    } else if (currentStep === 'booking') {
      setCurrentStep('address');
    } else if (currentStep === 'address') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      handleCompleteBooking();
    }
  };

  const handleCompleteBooking = async () => {
    const pendingBooking = JSON.parse(localStorage.getItem('pendingBooking'));
    
    const bookingData = {
      userId: user._id,
      handymanId: selectedHandyman._id,
      serviceType: 'electrical',
      date: pendingBooking.date,
      time: pendingBooking.time,
      zipCode: pendingBooking.zipCode,
      hours: pendingBooking.hours,
      jobDescription: pendingBooking.jobDescription,
      email: pendingBooking.email,
      phone: pendingBooking.phone,
      price: calculatePrice(pendingBooking.hours)
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });
  
      if (!response.ok) throw new Error(t('loading'));
      
      const data = await response.json();
      localStorage.removeItem('pendingBooking');
      navigate('/profile');
    } catch (error) {
      console.error(t('loading'), error);
    }
  };

  // Toggle FAQ expansion
  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };
  
  // Render the Contact Information step
  const renderContactStep = () => (
    <div className="form-container">
      <h2 className="section-title">{t('contactInformation')}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder={t('firstName')}
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
              placeholder={t('lastName')}
              className="form-input"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder={t('phoneNumber')}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            placeholder={t('zipCode')}
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="primary-button">{t('findHandymen')}</button>
      </form>
    </div>
  );

  // Render the Booking Options step with handyman selection
  const renderBookingStep = () => (
    <div className="form-container">
      <div className="contact-info-display">
        <div className="display-header">
          <h2 className="section-title">{t('contactInformation')}</h2>
          <button className="edit-button" onClick={() => setCurrentStep('contact')}>{t('edit')}</button>
        </div>
        <p>{formData.firstName} {formData.lastName}</p>
        <p>{formData.phoneNumber}</p>
        <p>{t('zipCode')}: {formData.zipCode}</p>
      </div>
      <div className="booking-options">
        <h2 className="section-title">{t('availableHandymen')}</h2>
        {isLoading ? (
          <p>{t('loadingHandymen')}</p>
        ) : matchedHandymen.length > 0 ? (
          <div className="handyman-list">
            {matchedHandymen.map((handyman, index) => (
              <div 
                key={handyman._id} 
                className={`handyman-card ${selectedHandyman && selectedHandyman._id === handyman._id ? 'selected' : ''}`}
                onClick={() => handleHandymanSelect(handyman)}
              >
                <div className="handyman-header">
                  <div className="handyman-info">
                    <h3>{handyman.name}</h3>
                    <div className="rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= Math.floor(handyman.rating) ? "star filled" : "star"}>★</span>
                      ))}
                      <span className="rating-text">{handyman.rating} | {handyman.reviews} {t('handymanReviews')}</span>
                    </div>
                    <div className="proximity-badge">
                      <MapPin size={14} />
                      {index === 0 ? (
                        <span className="proximity-text exact">{t('closestToYou')}</span>
                      ) : (
                        <span className="proximity-text nearby">{t('nearbyServiceProvider')}</span>
                      )}
                    </div>
                  </div>
                  {index === 0 && <div className="best-match-badge">{t('bestMatch')}</div>}
                </div>
                <div className="handyman-details">
                  <p className="handyman-bio">{handyman.bio}</p>
                  <div className="handyman-skills">
                    <strong>{t('handymanSkills')}:</strong> {handyman.skills.join(', ')}
                  </div>
                </div>
                <div className="handyman-select">
                  <div className="check-icon">
                    {selectedHandyman && selectedHandyman._id === handyman._id && <Check size={20} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>{t('noHandymen')}</p>
        )}
        
        {selectedHandyman && (
          <div className="booking-summary-card">
            <h3>{t('bookingSummary')}</h3>
            <div className="summary-details">
              <p><strong>{t('service')}:</strong> {bookingDetails?.serviceType || t('electricalService')}</p>
              <p><strong>{t('handyman')}:</strong> {selectedHandyman.name}</p>
              <p><strong>{t('date')}:</strong> {bookingDetails?.date}</p>
              <p><strong>{t('time')}:</strong> {bookingDetails?.time}</p>
              <p><strong>{t('zipCode')}:</strong> {formData.zipCode}</p>
              <p><strong>{t('duration')}:</strong> {bookingDetails?.hours ? getHoursFromBooking(bookingDetails) : 1} {t('hours')}</p>
              <p><strong>{t('price')}:</strong> {calculatePrice(bookingDetails?.hours)} MAD</p>
            </div>
            <button className="primary-button" onClick={() => setCurrentStep('address')}>{t('continueToAddress')}</button>
          </div>
        )}
      </div>
    </div>
  );

  // Render the Address step
  const renderAddressStep = () => (
    <div className="form-container">
      <div className="contact-info-display">
        <div className="display-header">
          <h2 className="section-title">{t('contactInformation')}</h2>
          <button className="edit-button" onClick={() => setCurrentStep('contact')}>{t('edit')}</button>
        </div>
        <p>{formData.firstName} {formData.lastName}</p>
        <p>{formData.phoneNumber}</p>
        <p>{t('zipCode')}: {formData.zipCode}</p>
      </div>
      
      <div className="handyman-display">
        <div className="display-header">
          <h2 className="section-title">{t('selectedHandyman')}</h2>
          <button className="edit-button" onClick={() => setCurrentStep('booking')}>{t('edit')}</button>
        </div>
        {selectedHandyman && (
          <div className="selected-handyman-info">
            <p>{selectedHandyman.name}</p>
            <p>{t('handymanRating')}: {selectedHandyman.rating} ({selectedHandyman.reviews} {t('handymanReviews')})</p>
          </div>
        )}
      </div>
      
      <div className="address-section">
        <h2 className="section-title">{t('serviceAddress')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="address">{t('address')}</label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              placeholder={t('address')}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="region">{t('region')}</label>
            <select
              name="region"
              value={formData.region || ""}
              onChange={handleRegionChange}
              className="form-select"
              required
            >
              <option value="">{t('selectRegion')}</option>
              {regions.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="city">{t('city')}</label>
            <select
              name="city"
              value={formData.city || ""}
              onChange={handleCityChange}
              className="form-select"
              required
              disabled={!formData.region}
            >
              <option value="">{t('selectCity')}</option>
              {formData.region &&
                citiesByRegion[formData.region].map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
            </select>
          </div>
          <button type="submit" className="primary-button">{t('continueToPayment')}</button>
        </form>
      </div>
    </div>
  );

  // Render the Payment step
  const renderPaymentStep = () => (
    <div className="form-container">
      <div className="contact-info-display">
        <div className="display-header">
          <h2 className="section-title">{t('contactInformation')}</h2>
          <button className="edit-button" onClick={() => setCurrentStep('contact')}>{t('edit')}</button>
        </div>
        <p>{formData.firstName} {formData.lastName}</p>
        <p>{formData.phoneNumber}</p>
        <p>{t('zipCode')}: {formData.zipCode}</p>
      </div>
      
      <div className="handyman-display">
        <div className="display-header">
          <h2 className="section-title">{t('selectedHandyman')}</h2>
          <button className="edit-button" onClick={() => setCurrentStep('booking')}>{t('edit')}</button>
        </div>
        {selectedHandyman && (
          <div className="selected-handyman-info">
            <p>{selectedHandyman.name}</p>
            <p>{t('handymanRating')}: {selectedHandyman.rating} ({selectedHandyman.reviews} {t('handymanReviews')})</p>
          </div>
        )}
      </div>
      
      <div className="address-info-display">
        <div className="display-header">
          <h2 className="section-title">{t('serviceAddress')}</h2>
          <button className="edit-button" onClick={() => setCurrentStep('address')}>{t('edit')}</button>
        </div>
        <p>{formData.address}</p>
        <p>{formData.city}, {formData.region}</p>
      </div>
      
      <h2 className="section-title">{t('payment')}</h2>
      <form onSubmit={handleSubmit}> 
        <div className="payment-method-selector">
          <label className="payment-option">
            <input
              type="radio"
              name="paymentMethod"
              value="credit"
              checked={formData.paymentMethod === 'credit'}
              onChange={handleChange}
            />
            <span className="payment-label">{t('creditCard')}</span>
          </label>
          <label className="payment-option">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={formData.paymentMethod === 'cash'}
              onChange={handleChange}
            />
            <span className="payment-label">{t('cash')}</span>
          </label>
        </div>
        {formData.paymentMethod === 'credit' && (
          <>
            <div className="form-group">
              <input
                type="text"
                name="creditCardNumber"
                value={formData.creditCardNumber}
                onChange={handleChange}
                placeholder={t('creditCard')}
                className="form-input"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="cvc"
                  value={formData.cvc}
                  onChange={handleChange}
                  placeholder="CVC"
                  className="form-input"
                  required
                />
              </div>
            </div>
          </>
        )}
        <div className="form-row promo-code">
          <div className="form-group">
            <input
              type="text"
              name="promoCode"
              value={formData.promoCode}
              onChange={handleChange}
              placeholder={t('promoCode')}
              className="form-input"
            />
          </div>
          <button type="button" className="secondary-button">{t('apply')}</button>
        </div>
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              required
            />
            <span>
              {t('termsAccepted')}
            </span>
          </label>
        </div>
        <button type="submit" className="primary-button">{t('completeBooking')}</button>
      </form>
    </div>
  );

  return (
    <div className="finalize-container">
      <Navbar />
      <div className="content-container">
        <div className="main-content">
          {currentStep === 'contact' && renderContactStep()}
          {currentStep === 'booking' && renderBookingStep()}
          {currentStep === 'address' && renderAddressStep()}
          {currentStep === 'payment' && renderPaymentStep()}
        </div>
        <div className="side-content">
          <div className="booking-summary">
            {bookingDetails ? (
              <>
                <h3>{t('electricalService')}</h3>
                <p>{t('date')}: {bookingDetails.date}</p>
                <p>{t('time')}: {bookingDetails.time}</p>
                <p>{t('duration')}: {getHoursFromBooking(bookingDetails)} {t('hours')}</p>
                <p>{t('price')}: {calculatePrice(bookingDetails.hours)} MAD</p>
                <p>{t('zipCode')}: {formData.zipCode}</p>
                {selectedHandyman && (
                  <>
                    <h4>{t('selectedHandyman')}</h4>
                    <p>{selectedHandyman.name}</p>
                    <div className="rating-small">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= Math.floor(selectedHandyman.rating) ? "star filled" : "star"}>★</span>
                      ))}
                      <span className="rating-text">{selectedHandyman.rating}</span>
                    </div>
                  </>
                )}
              </>
            ) : (
              <p>{t('loadingBookingSummary')}</p>
            )}
          </div>
          <div className="faq-section">
            <h3>{t('frequentlyAskedQuestions')}</h3>
            {faqItems.map((faq, index) => (
              <div key={index} className={`faq-item ${expandedFaq === index ? 'expanded' : ''}`}>
                <div className="faq-question" onClick={() => toggleFaq(index)}>
                  <span>{faq.question}</span>
                  {expandedFaq === index ? <Minus size={16} /> : <Plus size={16} />}
                </div>
                {expandedFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finalize;