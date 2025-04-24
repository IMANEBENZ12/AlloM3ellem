import React, { useState } from 'react';
import './Finalize.css';
import Navbar from "./Navbar.js";
import { Plus, Minus, Check, Shield } from 'lucide-react';

const Finalize = () => {
  // State to track which step of the process we're on
  const [currentStep, setCurrentStep] = useState('contact');
  
  // State to track expanded FAQ items
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    region: '',
    city: '',
    creditCardNumber: '',
    expiryDate: '',
    cvc: '',
    promoCode: '',
    termsAccepted: false,
    paymentMethod: 'credit' // 'credit' or 'cash'
  });
  
  
  // Booking details (would normally come from API/previous step)
  const bookingDetails = {
    service: 'Electrical Service',
    dateTime: 'Apr 23, 2025 at 2:00 pm',
    duration: '(2.0 hours)',
    price: '200',
    rating: 4.3,
    reviews: 19
  };
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
      question: "What services does AlloM3ellem offer?",
      answer: "AlloM3ellem connects you with skilled professionals for various home services including plumbing, electrical work, cleaning, carpentry, painting, and more. Whether it's a quick fix or a major renovation, we have you covered."
    },
    {
      question: "How do I book a service on AlloM3ellem?",
      answer: "Booking a service is easy! Simply visit our website, select the service you need, choose a date and time that works for you, and provide your contact details. A M3ellem will be assigned to you shortly after."
    },
    {
      question: "Is there a warranty on services provided?",
      answer: "Yes, AlloM3ellem offers a satisfaction guarantee on all services. If you're not happy with the work done, we'll make it right. Please refer to our service terms and conditions for more details."
    },
    {
      question: "Can I choose my M3ellem?",
      answer: "While we do not currently offer the option to choose a specific M3ellem, rest assured that all our professionals are thoroughly vetted and trained to provide high-quality service."
    },
    {
      question: "What if I need to reschedule or cancel a booking?",
      answer: "You can reschedule or cancel your booking up to 24 hours in advance without any penalty. Simply go to your booking details on our website or app and follow the instructions to make changes."
    },
    {
      question: "How are payments handled?",
      answer: "Payments are processed securely through our platform. You can pay using a credit card, debit card, or other digital payment methods. Cash payments may also be available in certain areas."
    },
    {
      question: "Is AlloM3ellem available in my city?",
      answer: "AlloM3ellem is expanding rapidly across Morocco. Please check our website to see the list of cities where we currently operate. If we're not in your city yet, stay tuned—we're coming soon!"
    },
    {
      question: "What makes AlloM3ellem different from other service platforms?",
      answer: "We prioritize customer satisfaction, quality service, and trust. Our M3ellems undergo rigorous screening and training, and our platform ensures a seamless experience from booking to service completion."
    },
    {
      question: "Do you offer emergency services?",
      answer: "Yes, AlloM3ellem offers emergency services for urgent issues such as water leaks or electrical faults. Select the emergency option when booking, and we'll dispatch someone as soon as possible."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach our customer support team through the contact form on our website, via email at support@allom3ellem.ma, or by calling our hotline. We are here to help!"
    },
    {
      question: "What is the Happiness Guarantee?",
      answer: "When you book with AlloM3ellem, your happiness is our goal. If you're not satisfied with the service, we'll work to make it right. This includes rescheduling the service or refunding your payment. For more details, see our Happiness Guarantee policy on our website."
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
      console.log('Complete booking with data:', formData);
      alert('Booking completed successfully!');
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
        <button type="submit" className="primary-button">Calculate Price</button>
      </form>
    </div>
  );

  // Render the Booking Options step
  const renderBookingStep = () => (
    <div className="form-container">
      <div className="contact-info-display">
        <div className="display-header">
          <h2 className="section-title">Contact Information</h2>
          <button className="edit-button" onClick={() => setCurrentStep('contact')}>Edit</button>
        </div>
        <p>{formData.firstName} {formData.lastName}</p>
        <p>{formData.phoneNumber}</p>
      </div>
      <div className="booking-options">
        <h2 className="section-title">Booking Options</h2>
        <div className="booking-option-card">
          <div className="booking-option-header">
            <div>
              <h3>Book with AlloM3ellem</h3>
              <div className="rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={star <= Math.floor(bookingDetails.rating) ? "star filled" : "star"}>★</span>
                ))}
                <span className="rating-text">{bookingDetails.rating} | {bookingDetails.reviews} verified reviews</span>
              </div>
            </div>
            <div className="price">Your Total: {bookingDetails.price}MAD</div>
          </div>
          <div className="booking-features">
            <div className="feature">
              <Shield size={16} />
              <span>Background-checked professionals</span>
            </div>
            <div className="feature">
              <Check size={16} />
              <span>Flexible rescheduling</span>
            </div>
          </div>
          <button className="primary-button" onClick={() => setCurrentStep('address')}>Continue to Address</button>
        </div>
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
              disabled={!formData.region} // Disable city dropdown if no region is selected
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
      </div>
      <div className="address-info-display">
        <div className="display-header">
          <h2 className="section-title">Service Address</h2>
          <button className="edit-button" onClick={() => setCurrentStep('address')}>Edit</button>
        </div>
        <p>{formData.address} </p>
        <p>{formData.city}, {formData.region} </p>
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
            <h3>{bookingDetails.service}</h3>
            <p>{bookingDetails.dateTime}</p>
            <p>{bookingDetails.duration}</p>
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

export default Finalize;