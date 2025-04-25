// Handymen.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import axios from 'axios';
import './Handymen.css';

const Handymen = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState({});
  const [recurringSchedule, setRecurringSchedule] = useState({
    monday: { isSet: false, startTime: '09:00', endTime: '17:00' },
    tuesday: { isSet: false, startTime: '09:00', endTime: '17:00' },
    wednesday: { isSet: false, startTime: '09:00', endTime: '17:00' },
    thursday: { isSet: false, startTime: '09:00', endTime: '17:00' },
    friday: { isSet: false, startTime: '09:00', endTime: '17:00' },
    saturday: { isSet: false, startTime: '09:00', endTime: '17:00' },
    sunday: { isSet: false, startTime: '09:00', endTime: '17:00' },
  });
  const [vacationDates, setVacationDates] = useState([]);
  const [vacationStart, setVacationStart] = useState(new Date());
  const [vacationEnd, setVacationEnd] = useState(new Date());
  const [activeTab, setActiveTab] = useState('daily');

  // Fetch handyman's availabilities and bookings on component mount
  useEffect(() => {
    fetchAvailabilities();
    fetchBookings();
  }, []);

  const fetchAvailabilities = async () => {
    try {
      const token = localStorage.getItem('handymanToken');
      const response = await axios.get('/api/handyman/availabilities', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAvailabilities(response.data.availabilities);
      
      // Set recurring schedule if it exists
      if (response.data.recurringSchedule) {
        setRecurringSchedule(response.data.recurringSchedule);
      }
      
      // Set vacation dates if they exist
      if (response.data.vacationDates) {
        setVacationDates(response.data.vacationDates);
      }
    } catch (error) {
      console.error('Error fetching availabilities:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('handymanToken');
      const response = await axios.get('/api/handyman/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Generate time slots for the selected date
  useEffect(() => {
    generateTimeSlots();
  }, [selectedDate, availabilities, bookings]);

  const generateTimeSlots = () => {
    const dayOfWeek = moment(selectedDate).format('dddd').toLowerCase();
    const dateString = moment(selectedDate).format('YYYY-MM-DD');
    
    // Check if day is in recurring schedule
    const recurringForDay = recurringSchedule[dayOfWeek];
    
    // Check if date is marked as vacation
    const isVacation = vacationDates.some(vacation => {
      const startDate = moment(vacation.startDate);
      const endDate = moment(vacation.endDate);
      return moment(dateString).isBetween(startDate, endDate, null, '[]');
    });
    
    // Check for specific availabilities for this date
    const specificAvail = availabilities.find(a => a.date === dateString);
    
    // Generate slots
    const slots = {};
    
    // If it's a vacation day, no slots available
    if (isVacation) {
      setTimeSlots({});
      return;
    }
    
    // If there's specific availability for this date, use that
    if (specificAvail) {
      for (let hour = 8; hour < 20; hour++) {
        const timeStr = `${hour}:00`;
        const formattedTime = moment(timeStr, 'HH:mm').format('h:mm A');
        
        const isAvailable = specificAvail.timeSlots.some(slot => 
          moment(slot.startTime, 'HH:mm').hour() === hour
        );
        
        const booking = bookings.find(booking => 
          booking.date === dateString && 
          moment(booking.startTime, 'HH:mm').hour() === hour
        );
        
        slots[formattedTime] = {
          available: isAvailable,
          booked: booking ? true : false,
          bookingInfo: booking || null
        };
      }
    } 
    // Otherwise use recurring schedule
    else if (recurringForDay.isSet) {
      const startHour = parseInt(recurringForDay.startTime.split(':')[0]);
      const endHour = parseInt(recurringForDay.endTime.split(':')[0]);
      
      for (let hour = 8; hour < 20; hour++) {
        const timeStr = `${hour}:00`;
        const formattedTime = moment(timeStr, 'HH:mm').format('h:mm A');
        
        const isAvailable = hour >= startHour && hour < endHour;
        
        const booking = bookings.find(booking => 
          booking.date === dateString && 
          moment(booking.startTime, 'HH:mm').hour() === hour
        );
        
        slots[formattedTime] = {
          available: isAvailable,
          booked: booking ? true : false,
          bookingInfo: booking || null
        };
      }
    } 
    // Default - no availability
    else {
      for (let hour = 8; hour < 20; hour++) {
        const timeStr = `${hour}:00`;
        const formattedTime = moment(timeStr, 'HH:mm').format('h:mm A');
        
        const booking = bookings.find(booking => 
          booking.date === dateString && 
          moment(booking.startTime, 'HH:mm').hour() === hour
        );
        
        slots[formattedTime] = {
          available: false,
          booked: booking ? true : false,
          bookingInfo: booking || null
        };
      }
    }
    
    setTimeSlots(slots);
  };

  // Toggle availability for a time slot
  const toggleTimeSlot = async (time) => {
    try {
      const token = localStorage.getItem('handymanToken');
      const dateString = moment(selectedDate).format('YYYY-MM-DD');
      const timeFormat = moment(time, 'h:mm A').format('HH:mm');
      
      // Find existing availability for this date
      const existingAvail = availabilities.find(a => a.date === dateString);
      
      if (existingAvail) {
        // Update existing availability
        const currentSlots = existingAvail.timeSlots;
        const slotIndex = currentSlots.findIndex(s => s.startTime === timeFormat);
        
        let updatedSlots;
        if (slotIndex >= 0) {
          // Remove slot if it exists
          updatedSlots = currentSlots.filter((_, i) => i !== slotIndex);
        } else {
          // Add slot if it doesn't exist
          updatedSlots = [...currentSlots, { 
            startTime: timeFormat, 
            endTime: moment(timeFormat, 'HH:mm').add(1, 'hour').format('HH:mm')
          }];
        }
        
        await axios.put(`/api/handyman/availabilities/${existingAvail._id}`, {
          timeSlots: updatedSlots
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create new availability for this date
        await axios.post('/api/handyman/availabilities', {
          date: dateString,
          timeSlots: [{ 
            startTime: timeFormat, 
            endTime: moment(timeFormat, 'HH:mm').add(1, 'hour').format('HH:mm')
          }]
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      // Refresh availabilities
      fetchAvailabilities();
    } catch (error) {
      console.error('Error updating time slot:', error);
    }
  };

  // Update recurring schedule
  const handleRecurringChange = async (day, field, value) => {
    try {
      const updatedSchedule = {
        ...recurringSchedule,
        [day]: {
          ...recurringSchedule[day],
          [field]: value
        }
      };
      
      setRecurringSchedule(updatedSchedule);
      
      const token = localStorage.getItem('handymanToken');
      await axios.put('/api/handyman/recurring-schedule', {
        recurringSchedule: updatedSchedule
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error updating recurring schedule:', error);
    }
  };

  // Add vacation period
  const addVacation = async () => {
    try {
      const token = localStorage.getItem('handymanToken');
      const startDate = moment(vacationStart).format('YYYY-MM-DD');
      const endDate = moment(vacationEnd).format('YYYY-MM-DD');
      
      await axios.post('/api/handyman/vacation', {
        startDate,
        endDate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh availabilities and vacation dates
      fetchAvailabilities();
    } catch (error) {
      console.error('Error adding vacation period:', error);
    }
  };

  // Remove vacation period
  const removeVacation = async (vacationId) => {
    try {
      const token = localStorage.getItem('handymanToken');
      await axios.delete(`/api/handyman/vacation/${vacationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh availabilities and vacation dates
      fetchAvailabilities();
    } catch (error) {
      console.error('Error removing vacation period:', error);
    }
  };

  // Custom tile content for the calendar to show availability and bookings
  const tileContent = ({ date }) => {
    const dateStr = moment(date).format('YYYY-MM-DD');
    const hasAvailability = availabilities.some(a => a.date === dateStr);
    const hasBooking = bookings.some(b => b.date === dateStr);
    const isVacation = vacationDates.some(v => {
      return moment(dateStr).isBetween(
        moment(v.startDate), 
        moment(v.endDate), 
        null, 
        '[]'
      );
    });
    
    const dayOfWeek = moment(date).format('dddd').toLowerCase();
    const hasRecurring = recurringSchedule[dayOfWeek].isSet;
    
    return (
      <div className="calendar-tile-content">
        {isVacation && <div className="vacation-marker"></div>}
        {hasBooking && <div className="booking-marker"></div>}
        {(hasAvailability || hasRecurring) && !isVacation && <div className="availability-marker"></div>}
      </div>
    );
  };

  return (
    <div className="handyman-dashboard">
      <h1>Handyman Dashboard</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === 'daily' ? 'active' : ''} 
          onClick={() => setActiveTab('daily')}
        >
          Daily Availability
        </button>
        <button 
          className={activeTab === 'recurring' ? 'active' : ''} 
          onClick={() => setActiveTab('recurring')}
        >
          Weekly Schedule
        </button>
        <button 
          className={activeTab === 'vacation' ? 'active' : ''} 
          onClick={() => setActiveTab('vacation')}
        >
          Block Out Time
        </button>
        <button 
          className={activeTab === 'bookings' ? 'active' : ''} 
          onClick={() => setActiveTab('bookings')}
        >
          My Bookings
        </button>
      </div>

      {activeTab === 'daily' && (
        <div className="daily-availability">
          <div className="calendar-container">
            <h2>Select Date</h2>
            <Calendar 
              onChange={setSelectedDate} 
              value={selectedDate} 
              tileContent={tileContent}
            />
          </div>
          
          <div className="time-slots">
            <h2>Availability for {moment(selectedDate).format('MMMM D, YYYY')}</h2>
            <p className="instructions">Click on a time slot to toggle availability</p>
            
            <div className="slots-grid">
              {Object.entries(timeSlots).map(([time, info]) => (
                <div 
                  key={time}
                  className={`time-slot ${info.available ? 'available' : ''} ${info.booked ? 'booked' : ''}`}
                  onClick={() => !info.booked && toggleTimeSlot(time)}
                >
                  <span className="time">{time}</span>
                  {info.booked && (
                    <div className="booking-info">
                      <p>Booked: {info.bookingInfo.serviceType}</p>
                      <p>Client: {info.bookingInfo.clientName}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recurring' && (
        <div className="recurring-schedule">
          <h2>Set Your Weekly Schedule</h2>
          <p className="instructions">Configure your regular weekly availability</p>
          
          <div className="weekly-grid">
            {Object.entries(recurringSchedule).map(([day, schedule]) => (
              <div key={day} className="day-row">
                <div className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                <div className="day-toggle">
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={schedule.isSet}
                      onChange={(e) => handleRecurringChange(day, 'isSet', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                {schedule.isSet && (
                  <div className="time-range">
                    <div className="time-input">
                      <label>From:</label>
                      <select 
                        value={schedule.startTime}
                        onChange={(e) => handleRecurringChange(day, 'startTime', e.target.value)}
                      >
                        {Array.from({length: 13}, (_, i) => i + 8).map(hour => (
                          <option key={hour} value={`${hour}:00`}>
                            {moment(`${hour}:00`, 'HH:mm').format('h:mm A')}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="time-input">
                      <label>To:</label>
                      <select 
                        value={schedule.endTime}
                        onChange={(e) => handleRecurringChange(day, 'endTime', e.target.value)}
                      >
                        {Array.from({length: 13}, (_, i) => i + 8).map(hour => (
                          <option key={hour} value={`${hour}:00`}>
                            {moment(`${hour}:00`, 'HH:mm').format('h:mm A')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'vacation' && (
        <div className="vacation-block">
          <h2>Block Out Time Off</h2>
          <p className="instructions">Set vacation or unavailable periods</p>
          
          <div className="add-vacation">
            <div className="date-range">
              <div className="date-input">
                <label>Start Date:</label>
                <input 
                  type="date" 
                  value={moment(vacationStart).format('YYYY-MM-DD')}
                  onChange={(e) => setVacationStart(new Date(e.target.value))}
                />
              </div>
              
              <div className="date-input">
                <label>End Date:</label>
                <input 
                  type="date" 
                  value={moment(vacationEnd).format('YYYY-MM-DD')}
                  onChange={(e) => setVacationEnd(new Date(e.target.value))}
                />
              </div>
            </div>
            
            <button className="add-btn" onClick={addVacation}>
              Block This Time
            </button>
          </div>
          
          <div className="vacation-list">
            <h3>Blocked Periods</h3>
            {vacationDates.length === 0 ? (
              <p>No blocked periods set</p>
            ) : (
              <ul>
                {vacationDates.map((vacation, index) => (
                  <li key={index} className="vacation-item">
                    <span>
                      {moment(vacation.startDate).format('MMM D, YYYY')} - 
                      {moment(vacation.endDate).format('MMM D, YYYY')}
                    </span>
                    <button 
                      className="remove-btn"
                      onClick={() => removeVacation(vacation._id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bookings-list">
          <h2>My Bookings</h2>
          
          {bookings.length === 0 ? (
            <p>No bookings scheduled</p>
          ) : (
            <div className="bookings-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Service</th>
                    <th>Client</th>
                    <th>Address</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.sort((a, b) => {
                    // Sort by date and time
                    const dateA = new Date(`${a.date}T${a.startTime}`);
                    const dateB = new Date(`${b.date}T${b.startTime}`);
                    return dateA - dateB;
                  }).map((booking) => (
                    <tr key={booking._id} className={`booking-row ${booking.status.toLowerCase()}`}>
                      <td>{moment(booking.date).format('MMM D, YYYY')}</td>
                      <td>{moment(booking.startTime, 'HH:mm').format('h:mm A')}</td>
                      <td>{booking.serviceType}</td>
                      <td>{booking.clientName}</td>
                      <td>{booking.address}</td>
                      <td>{booking.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Handymen;