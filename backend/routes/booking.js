// filepath: c:\HandyMan_Tests\app-test-2\backend\routes\booking.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');

// Create a new booking
router.post('/', async (req, res) => {
  console.log('Request body:', req.body); // Log the request body for debugging

  const {
    userId,
    handymanId,
    serviceType,
    date,
    time,
    beds,
    baths,
    zipCode,
    price,
    hours: rawHours, // Extract hours as raw input
    jobDescription,
    email,
    phone,
  } = req.body;

  try {
    // Parse hours to ensure it's a numeric value
    const hours = parseInt(rawHours, 10) || 1; // Default to 1 if parsing fails

    const booking = new Booking({
      userId,
      handymanId,
      serviceType,
      date,
      time,
      beds,
      baths,
      zipCode,
      price,
      hours, // Use the parsed numeric hours
      jobDescription,
      email,
      phone,
    });

    await booking.save();
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({ error: error.message });
  }
});

// Save a new booking
router.post('/save', async (req, res) => {
  try {
    const {
      userId,
      handymanId,
      serviceType,
      date,
      time,
      zipCode,
      price,
      hours: rawHours, // Extract hours as raw input
      jobDescription,
      email,
      phone,
    } = req.body;

    // Parse hours to ensure it's a numeric value
    const hours = parseInt(rawHours, 10) || 1; // Default to 1 if parsing fails

    // Create a new booking
    const booking = new Booking({
      userId,
      handymanId,
      serviceType,
      date,
      time,
      zipCode,
      price,
      hours, // Use the parsed numeric hours
      jobDescription,
      email,
      phone,
    });

    // Save the booking to the database
    await booking.save();
    res.status(201).json({ message: 'Booking saved successfully', booking });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ error: 'Failed to save booking' });
  }
});
// Get the latest booking
router.get('/latest', async (req, res) => {
  try {
    const latestBooking = await Booking.findOne().sort({ createdAt: -1 });
    if (!latestBooking) {
      return res.status(404).json({ message: 'No bookings found' });
    }
    res.json(latestBooking);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get bookings for a user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const bookings = await Booking.find({ userId }).populate('handymanId','name');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get bookings for a user (assuming user ID is available in the request object)
router.get('/user', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token to get the user ID
    const userId = decoded.id;

    const bookings = await Booking.find({ userId }).populate('handymanId', 'name'); // Fetch bookings for the user
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});
router.post('/:id/rate', async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.rating = rating;
    booking.comment = comment;
    await booking.save();

    res.status(200).json({ message: 'Rating submitted successfully', booking });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});
// Add this to your booking.js routes file
router.patch('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if booking can be cancelled (e.g., not already completed)
    const bookingDate = new Date(booking.date);
    const [hours, minutes] = booking.time.split(':').map(Number);
    bookingDate.setHours(hours, minutes, 0, 0);
    
    if (bookingDate < new Date()) {
      return res.status(400).json({ error: 'Cannot cancel past bookings' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});
// Save finalized cleaning booking
router.post('/finalize', async (req, res) => {
  const {
    zipCode,
    beds,
    baths,
    date,
    time,
    email,
    serviceType,
  } = req.body;

  try {
    // Create a new booking
    const booking = new Booking({
      zipCode,
      beds,
      baths,
      date,
      time,
      email,
      serviceType,
      status: 'upcoming', // Mark the booking as upcoming
    });

    // Save the booking to the database
    await booking.save();
    res.status(201).json({ message: 'Booking finalized successfully', booking });
  } catch (error) {
    console.error('Error finalizing booking:', error);
    res.status(500).json({ error: 'Failed to finalize booking' });
  }
});

module.exports = router;