import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Finalize.css';
import Navbar from "./Navbar.js";
import { Plus, Minus, Check, Shield, Star, MapPin } from 'lucide-react';

const FinalizeCleaning = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // State to track which step of the process we're on
  const [currentStep, setCurrentStep] = useState('contact');
  
  // State to track expanded FAQ items
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  // State for booking details fetched from the backend
  const [bookingDetails, setBookingDetails] = useState(null);
  
  // State for matched handymen (cleaners)
  const [matchedHandymen, setMatchedHandymen] = useState([]);
  
  // State for selected handyman (cleaner)
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
    handymanId: '' // ID of the selected handyman (cleaner)
  });

  // Calculate price based on beds and baths
  const calculatePrice = (beds, baths) => {
    const pricePerBed = 50; // 50 MAD per bed
    const pricePerBath = 75; // 75 MAD per bath
    return beds * pricePerBed + baths * pricePerBath;
  };

  // Fetch booking details from the backend
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cleaning-bookings/latest');
        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }
        const data = await response.json();
        console.log('Fetched booking details:', data);
        setBookingDetails(data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };

    fetchBookingDetails();
  }, []);

  // Fetch matched handymen (cleaners) when zipCode changes
  useEffect(() => {
    const fetchMatchedHandymen = async () => {
      if (!formData.zipCode || formData.zipCode.length < 5) return;

      setIsLoading(true);
      try {
        // Fetch handymen with serviceType 'cleaning' for the given zip code
        const response = await fetch(`http://localhost:5000/api/handymen/match/${formData.zipCode}/cleaning`);

        if (!response.ok) {
          throw new Error('Failed to fetch matched cleaners');
        }

        const data = await response.json();
        console.log('Fetched handymen (cleaners):', data);

        setMatchedHandymen(data);

        // Auto-select the first handyman (cleaner) (best match)
        if (data.length > 0 && !selectedHandyman) {
          setSelectedHandyman(data[0]);
          setFormData(prev => ({ ...prev, handymanId: data[0]._id }));
        }
      } catch (error) {
        console.error('Error fetching matched cleaners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchedHandymen();
  }, [formData.zipCode]);

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
    {
      question: "What types of cleaning services do you offer?",
      answer: "We offer a variety of cleaning services including regular home cleaning, deep cleaning, move-in/move-out cleaning, and office cleaning. Our professionals are equipped to handle all your cleaning needs."
    },
    {
      question: "Do I need to provide cleaning supplies?",
      answer: "No, our cleaners come fully equipped with all necessary cleaning supplies and equipment. However, if you have specific products you'd like us to use, you can let us know in advance."
    },
    {
      question: "How long does a cleaning service typically take?",
      answer: "The duration depends on the size of your space and the type of service. A standard cleaning for a 2-bedroom apartment typically takes 2-3 hours, while deep cleaning may take longer."
    },
    {
      question: "Can I request specific areas to focus on?",
      answer: "Absolutely! You can specify which areas of your home you'd like us to focus on, and we'll make sure to give them extra attention."
    },
    {
      question: "What if I need to reschedule or cancel my cleaning?",
      answer: "You can reschedule or cancel your booking up to 24 hours in advance without any penalty. Please contact us as soon as possible if you need to make changes."
    },
    {
      question: "Are your cleaners background-checked?",
      answer: "Yes, all our cleaners undergo thorough background checks and are carefully vetted to ensure your safety and peace of mind."
    },
    {
      question: "What is your satisfaction guarantee?",
      answer: "If you're not completely satisfied with your cleaning, let us know within 24 hours and we'll come back to re-clean the areas of concern at no additional cost."
    }
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

  // Handler for handyman (cleaner) selection
  const handleHandymanSelect = (handyman) => {
    console.log('Selected handyman (cleaner):', handyman);
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
    const totalPrice = calculatePrice(bookingDetails?.beds, bookingDetails?.baths);
  
    const bookingData = {
      userId: user._id,
      handymanId: selectedHandyman._id,
      serviceType: 'cleaning',
      date: bookingDetails.date,
      time: bookingDetails.time,
      beds: bookingDetails.beds,
      baths: bookingDetails.baths,
      zipCode: formData.zipCode,
      price: totalPrice,
      address: formData.address,
      region: formData.region,
      city: formData.city,
      paymentMethod: formData.paymentMethod,
      email: user.email
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/cleaning-bookings/finalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to save booking');
      }
  
      const data = await response.json();
      console.log('Booking saved:', data);
      alert('Booking completed successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error completing booking:', error);
      alert('Failed to complete booking. Please try again.');
    }
  };

  // Toggle FAQ expansion
  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };
  
  // Render the Contact Information step
  const renderContactStep = () => (
    <div className="form-container">
      <h2 className="section-title">Contact Information</h2>
      <form onSubmit={handleSubmit}>
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
        <div className="form-group">
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
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
            placeholder="Zip Code"
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="primary-button">Find Cleaners</button>
      </form>
    </div>
  );

  // Render the Booking Options step with handyman (cleaner) selection
  const renderBookingStep = () => (
    <div className="form-container">
      <div className="contact-info-display">
        <div className="display-header">
          <h2 className="section-title">Contact Information</h2>
          <button className="edit-button" onClick={() => setCurrentStep('contact')}>Edit</button>
        </div>
        <p>{formData.firstName} {formData.lastName}</p>
        <p>{formData.phoneNumber}</p>
        <p>Zip Code: {formData.zipCode}</p>
      </div>
      <div className="booking-options">
        <h2 className="section-title">Available Cleaners</h2>
        {isLoading ? (
          <p>Finding the best cleaners in your area...</p>
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
                      <span className="rating-text">{handyman.rating} | {handyman.reviews} verified reviews</span>
                    </div>
                    <div className="proximity-badge">
                      <MapPin size={14} />
                      {index === 0 ? (
                        <span className="proximity-text exact">Closest to you!</span>
                      ) : (
                        <span className="proximity-text nearby">Nearby service provider</span>
                      )}
                    </div>
                  </div>
                  {index === 0 && <div className="best-match-badge">Best Match</div>}
                </div>
                <div className="handyman-details">
                  <p className="handyman-bio">{handyman.bio}</p>
                  <div className="handyman-skills">
                    <strong>Specialties:</strong> {handyman.skills.join(', ')}
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
          <p>No cleaners available for your area. Please try a different zip code.</p>
        )}
        
        {selectedHandyman && bookingDetails && (
          <div className="booking-summary-card">
            <h3>Booking Summary</h3>
            <div className="summary-details">
              <p><strong>Service:</strong> Cleaning Service</p>
              <p><strong>Cleaner:</strong> {selectedHandyman.name}</p>
              <p><strong>Date:</strong> {bookingDetails.date}</p>
              <p><strong>Time:</strong> {bookingDetails.time}</p>
              <p><strong>Beds:</strong> {bookingDetails.beds}</p>
              <p><strong>Baths:</strong> {bookingDetails.baths}</p>
              <p><strong>Zip Code:</strong> {formData.zipCode}</p>
              <p><strong>Price:</strong> {calculatePrice(bookingDetails.beds, bookingDetails.baths)} MAD</p>
            </div>
            <button className="primary-button" onClick={() => setCurrentStep('address')}>Continue to Address</button>
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
          <h2 className="section-title">Contact Information</h2>
          <button className="edit-button" onClick={() => setCurrentStep('contact')}>Edit</button>
        </div>
        <p>{formData.firstName} {formData.lastName}</p>
        <p>{formData.phoneNumber}</p>
        <p>Zip Code: {formData.zipCode}</p>
      </div>
      
      <div className="handyman-display">
        <div className="display-header">
          <h2 className="section-title">Selected Cleaner</h2>
          <button className="edit-button" onClick={() => setCurrentStep('booking')}>Change</button>
        </div>
        {selectedHandyman && (
          <div className="selected-handyman-info">
            <p>{selectedHandyman.name}</p>
            <p>Rating: {selectedHandyman.rating} ({selectedHandyman.reviews} reviews)</p>
          </div>
        )}
      </div>
      
      <div className="address-section">
        <h2 className="section-title">Service Address</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              placeholder="Enter your street address"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="region">Region</label>
            <select
              name="region"
              value={formData.region || ""}
              onChange={handleRegionChange}
              className="form-select"
              required
            >
              <option value="">Select a region</option>
              {regions.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <select
              name="city"
              value={formData.city || ""}
              onChange={handleCityChange}
              className="form-select"
              required
              disabled={!formData.region}
            >
              <option value="">Select a city</option>
              {formData.region &&
                citiesByRegion[formData.region].map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
            </select>
          </div>
          <button type="submit" className="primary-button">Continue to Payment</button>
        </form>
      </div>
    </div>
  );

  // Render the Payment step
  const renderPaymentStep = () => (
    <div className="form-container">
      <div className="contact-info-display">
        <div className="display-header">
          <h2 className="section-title">Contact Information</h2>
          <button className="edit-button" onClick={() => setCurrentStep('contact')}>Edit</button>
        </div>
        <p>{formData.firstName} {formData.lastName}</p>
        <p>{formData.phoneNumber}</p>
        <p>Zip Code: {formData.zipCode}</p>
      </div>
      
      <div className="handyman-display">
        <div className="display-header">
          <h2 className="section-title">Selected Cleaner</h2>
          <button className="edit-button" onClick={() => setCurrentStep('booking')}>Change</button>
        </div>
        {selectedHandyman && (
          <div className="selected-handyman-info">
            <p>{selectedHandyman.name}</p>
            <p>Rating: {selectedHandyman.rating} ({selectedHandyman.reviews} reviews)</p>
          </div>
        )}
      </div>
      
      <div className="address-info-display">
        <div className="display-header">
          <h2 className="section-title">Service Address</h2>
          <button className="edit-button" onClick={() => setCurrentStep('address')}>Edit</button>
        </div>
        <p>{formData.address}</p>
        <p>{formData.city}, {formData.region}</p>
      </div>
      
      <h2 className="section-title">Payment</h2>
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
            <span className="payment-label">Credit Card</span>
          </label>
          <label className="payment-option">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={formData.paymentMethod === 'cash'}
              onChange={handleChange}
            />
            <span className="payment-label">Cash</span>
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
                placeholder="Credit Card Number"
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
              placeholder="Promo Code"
              className="form-input"
            />
          </div>
          <button type="button" className="secondary-button">Apply</button>
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
              I understand that I am purchasing a service subject to AlloM3ellem's{' '}
              <a href="#terms" className="link">Terms of Use</a> and{' '}
              <a href="#policy" className="link">Cancellation Policy</a>
              {' '}and my payment method will be charged before the service.
            </span>
          </label>
        </div>
        <button type="submit" className="primary-button">Complete Booking</button>
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
                <h3>Cleaning Service</h3>
                <p>Date: {bookingDetails.date}</p>
                <p>Time: {bookingDetails.time}</p>
                <p>Beds: {bookingDetails.beds}</p>
                <p>Baths: {bookingDetails.baths}</p>
                <p>Price: {calculatePrice(bookingDetails.beds, bookingDetails.baths)} MAD</p>
                <p>Zip Code: {bookingDetails.zipCode}</p>
                {selectedHandyman && (
                  <>
                    <h4>Your Cleaner</h4>
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
              <p>Loading booking summary...</p>
            )}
          </div>
          <div className="faq-section">
            <h3>Frequently Asked Questions</h3>
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

export default FinalizeCleaning;