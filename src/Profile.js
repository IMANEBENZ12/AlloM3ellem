import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Profile.css';
import Navbar from "./Navbar.js";
import { Shield } from 'lucide-react';

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  const [ratingData, setRatingData] = useState({});
  const [activeTab, setActiveTab] = useState('upcoming');

  // Fetch user data and bookings on component mount
  useEffect(() => {
    const fetchUserData = () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setUser(storedUser);
        setFormData({
          firstName: storedUser.firstName,
          lastName: storedUser.lastName,
          email: storedUser.email,
          phoneNumber: storedUser.phoneNumber || '',
          address: storedUser.address || ''
        });
      } else {
        navigate('/login');
      }
    };

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/bookings/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(t('errors.fetchBookings'));
        }

        const data = await response.json();
        setBookings(data);
        categorizeBookings(data);
      } catch (error) {
        console.error(t('errors.fetchError'), error);
        alert(t('errors.fetchBookings'));
      }
    };

    fetchUserData();
    fetchBookings();
  }, [navigate, t]);

  // Categorize bookings as past or upcoming based on date and time
  const categorizeBookings = (bookingsData) => {
    const now = new Date();
    const past = [];
    const upcoming = [];
  
    bookingsData.forEach((booking) => {
      if (booking.status === 'cancelled') return;

      const bookingDateTime = new Date(booking.date);
      const [hours, minutes] = booking.time.split(':').map(Number);
      bookingDateTime.setHours(hours, minutes, 0, 0);
  
      const endTime = new Date(bookingDateTime);
      endTime.setHours(endTime.getHours() + (booking.hours || 1));
  
      const ratingTime = new Date(endTime);
      ratingTime.setMinutes(ratingTime.getMinutes() + 30);
  
      if (ratingTime <= now) {
        past.push({ ...booking, canRate: !booking.rating });
      } else {
        upcoming.push(booking);
      }
    });
  
    setPastBookings(past);
    setUpcomingBookings(upcoming);
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm(t('confirmation.cancelBooking'))) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(t('errors.cancelBooking'));
      }

      const updatedBookings = bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
      );
      
      setBookings(updatedBookings);
      categorizeBookings(updatedBookings);
      
      alert(t('alerts.bookingCancelled'));
    } catch (error) {
      console.error(t('errors.cancelError'), error);
      alert(t('errors.cancelBooking'));
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRatingChange = (e, bookingId) => {
    const { name, value } = e.target;
    setRatingData(prevState => ({
      ...prevState,
      [bookingId]: {
        ...prevState[bookingId],
        [name]: value,
      },
    }));
  };

  const handleRatingSubmit = async (e, bookingId) => {
    e.preventDefault();
    const { rating, comment } = ratingData[bookingId] || {};

    if (!rating) {
      alert(t('confirmation.ratingRequired'));
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) {
        throw new Error(t('errors.ratingFailed'));
      }

      alert(t('alerts.ratingSubmitted'));
      
      const updatedPastBookings = pastBookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, rating, comment, canRate: false } 
          : booking
      );
      
      setPastBookings(updatedPastBookings);
      
      const newRatingData = { ...ratingData };
      delete newRatingData[bookingId];
      setRatingData(newRatingData);
      
    } catch (error) {
      console.error(t('errors.ratingError'), error);
      alert(t('errors.ratingFailed'));
    }
  };

  // Handle form submission to update user info
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(t('errors.updateFailed'));
      }
      
      const updatedUser = await response.json();
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
      alert(t('alerts.profileUpdated'));
    } catch (error) {
      console.error(t('errors.updateError'), error);
      alert(t('errors.updateFailed'));
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Star rating display for already rated bookings
  const DisplayStars = ({ rating }) => {
    return (
      <div className="stars-display">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`star ${parseInt(rating) >= star ? 'star-filled' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Interactive star rating for rating input
  const RatingInput = ({ bookingId }) => {
    const rating = ratingData[bookingId]?.rating || 0;
    
    return (
      <div className="stars-input">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => 
              setRatingData({
                ...ratingData,
                [bookingId]: { ...ratingData[bookingId], rating: star }
              })
            }
            className={`star-btn ${parseInt(rating) >= star ? 'star-selected' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-header">
        <h1>{t('profileTitle')}</h1>
        <button className="logout-btn" onClick={handleLogout}>{t('logout')}</button>
      </div>

      {user ? (
        <div className="profile-content">
          {/* User Information Section */}
          <div className="profile-info">
            <div className="info-header">
              <h2>{t('personalInformation')}</h2>
              {!isEditing && (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  {t('edit')}
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="profile-form">
                <div className="form-group">
                  <label>{t('form.firstName')}</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('form.lastName')}</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('form.email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('form.phone')}</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>{t('form.address')}</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">{t('save')}</button>
                  <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                    {t('cancel')}
                  </button>
                </div>
              </form>
            ) : (
              <div className="user-details">
                <div className="detail-item">
                  <span className="detail-label">{t('fullName')}:</span>
                  <span className="detail-value">{user.firstName} {user.lastName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t('form.email')}:</span>
                  <span className="detail-value">{user.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t('form.phone')}:</span>
                  <span className="detail-value">{user.phoneNumber || t('notProvided')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t('form.address')}:</span>
                  <span className="detail-value">{user.address || t('notProvided')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Bookings Section */}
          <div className="bookings-section">
            <h2>{t('myBookings')}</h2>
            
            {/* Tabs */}
            <div className="booking-tabs">
              <button 
                className={`tab ${activeTab === 'upcoming' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                {t('upcoming')} ({upcomingBookings.length})
              </button>
              <button 
                className={`tab ${activeTab === 'past' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('past')}
              >
                {t('past')} ({pastBookings.length})
              </button>
            </div>

            {/* Bookings List */}
            <div className="bookings-list">
              {activeTab === 'upcoming' ? (
                upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => (
                    <div key={booking._id} className="booking-card">
                      <div className="booking-header">
                        <h3>{booking.serviceType}</h3>
                        <span className="status upcoming">{t('bookingCard.statusUpcoming')}</span>
                      </div>
                      <div className="booking-details">
                        <div className="detail-row">
                          <div className="detail-col">
                            <span className="detail-label">{t('bookingCard.dateTime')}:</span>
                            <span className="detail-value">{formatDate(booking.date)} {t('at')} {booking.time}</span>
                          </div>
                          <div className="detail-col">
                            <span className="detail-label">{t('bookingCard.duration')}:</span>
                            <span className="detail-value">{booking.hours || 1} {t('hours')}</span>
                          </div>
                        </div>
                        <div className="detail-row">
                          <div className="detail-col">
                            <span className="detail-label">{t('bookingCard.location')}:</span>
                            <span className="detail-value">{t('zipCode')}: {booking.zipCode}</span>
                          </div>
                          <div className="detail-col">
                            <span className="detail-label">{t('bookingCard.handyman')}:</span>
                            <span className="detail-value">{booking.handymanId?.name || t('notAssigned')}</span>
                          </div>
                        </div>
                        {booking.price && (
                          <div className="detail-row">
                            <div className="detail-col">
                              <span className="detail-label">{t('bookingCard.price')}:</span>
                              <span className="detail-value">{booking.price}DH</span>
                            </div>
                          </div>
                        )}
                      </div>
                      {booking.jobDescription && (
                        <div className="job-description">
                          <span className="detail-label">{t('bookingCard.jobDescription')}:</span>
                          <p>{booking.jobDescription}</p>
                        </div>
                      )}
                      
                      <div className="booking-actions">
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="cancel-btn"
                        >
                          {t('bookingCard.cancelBooking')}
                        </button>
                        <p className="cancellation-policy">
                          <Shield size={14} /> {t('bookingCard.cancellationPolicy')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-bookings">{t('noBookings.upcoming')}</div>
                )
              ) : (
                pastBookings.length > 0 ? (
                  pastBookings.map((booking) => (
                    <div key={booking._id} className="booking-card">
                      <div className="booking-header">
                        <h3>{booking.serviceType}</h3>
                        <span className="status completed">{t('bookingCard.statusCompleted')}</span>
                      </div>
                      <div className="booking-details">
                        <div className="detail-row">
                          <div className="detail-col">
                            <span className="detail-label">{t('bookingCard.dateTime')}:</span>
                            <span className="detail-value">{formatDate(booking.date)} {t('at')} {booking.time}</span>
                          </div>
                          <div className="detail-col">
                            <span className="detail-label">{t('bookingCard.duration')}:</span>
                            <span className="detail-value">{booking.hours || 1} {t('hours')}</span>
                          </div>
                        </div>
                        <div className="detail-row">
                          <div className="detail-col">
                            <span className="detail-label">{t('bookingCard.location')}:</span>
                            <span className="detail-value">{t('zipCode')}: {booking.zipCode}</span>
                          </div>
                          <div className="detail-col">
                            <span className="detail-label">{t('bookingCard.handyman')}:</span>
                            <span className="detail-value">{booking.handymanId?.name || t('notAssigned')}</span>
                          </div>
                        </div>
                        {booking.price && (
                          <div className="detail-row">
                            <div className="detail-col">
                              <span className="detail-label">{t('bookingCard.price')}:</span>
                              <span className="detail-value">{booking.price}DH</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="rating-section">
                        {booking.rating ? (
                          <div className="rating-display">
                            <div className="rating-row">
                              <span className="rating-label">{t('bookingCard.yourRating')}:</span>
                              <DisplayStars rating={booking.rating} />
                            </div>
                            {booking.comment && (
                              <div className="comment-display">
                                <span className="rating-label">{t('bookingCard.yourComment')}:</span>
                                <p>{booking.comment}</p>
                              </div>
                            )}
                          </div>
                        ) : booking.canRate ? (
                          <form onSubmit={(e) => handleRatingSubmit(e, booking._id)} className="rating-form">
                            <div className="rating-input-group">
                              <label>{t('bookingCard.rateService')}:</label>
                              <RatingInput bookingId={booking._id} />
                            </div>
                            <div className="comment-input-group">
                              <label>{t('bookingCard.leaveComment')}:</label>
                              <textarea
                                name="comment"
                                rows="2"
                                value={ratingData[booking._id]?.comment || ''}
                                onChange={(e) => handleRatingChange(e, booking._id)}
                                placeholder={t('bookingCard.shareExperience')}
                              ></textarea>
                            </div>
                            <button type="submit" className="submit-rating-btn">
                              {t('bookingCard.submitRating')}
                            </button>
                          </form>
                        ) : (
                          <p className="no-rating">{t('bookingCard.noRating')}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-bookings">{t('noBookings.past')}</div>
                )
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="loading-container">
          <div className="loading-animation">
            <div className="spinner"></div>
            <p>{t('loadingProfile')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;