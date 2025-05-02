const express = require('express');
const router = express.Router();
const CleaningBooking = require('../models/CleaningBooking');




// Handle cleaning booking submission
router.post('/', async (req, res) => {
  const { zipCode, beds, baths, date, time, email } = req.body;

  

  try {
    // Create a new cleaning booking
    const cleaningBooking = new CleaningBooking({
      zipCode,
      beds,
      baths,
      date,
      time,
      email,
    });

    await cleaningBooking.save();
    res.status(201).json({ message: "Booking created successfully. A price estimate will be sent to your email soon.", cleaningBooking });
  } catch (error) {
    console.error('Error creating cleaning booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});
router.get('/latest', async (req, res) => {
    try {
      const latestBooking = await CleaningBooking.findOne().sort({ createdAt: -1 });
      if (!latestBooking) {
        return res.status(404).json({ message: 'No cleaning bookings found.' });
      }
      res.status(200).json(latestBooking);
    } catch (error) {
      console.error('Error fetching latest cleaning booking:', error);
      res.status(500).json({ error: 'Failed to fetch latest cleaning booking.' });
    }
  });
  

// Finalize a cleaning booking
router.post('/finalize', async (req, res) => {
  const { userId, handymanId, serviceType, date, time, beds, baths, zipCode, price, address, region, city, paymentMethod } = req.body;

  try {
    // Validate required fields
    if (!userId || !handymanId || !serviceType || !date || !time || !beds || !baths || !zipCode || !price || !address || !region || !city || !paymentMethod) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Save the finalized booking
    const finalizedBooking = new CleaningBooking({
      userId,
      handymanId,
      serviceType,
      date,
      time,
      beds,
      baths,
      zipCode,
      price,
      address,
      region,
      city,
      paymentMethod,
    });

    await finalizedBooking.save();
    res.status(201).json({ message: 'Cleaning booking finalized successfully.', finalizedBooking });
  } catch (error) {
    console.error('Error finalizing cleaning booking:', error);
    res.status(500).json({ error: 'Failed to finalize cleaning booking.' });
  }
});

const handleSubmit = async (e) => {
  e.preventDefault();

  const bookingData = {
    zipCode: zip,
    beds: parseInt(beds, 10),
    baths: parseInt(baths, 10),
    date,
    time,
    email,
    serviceType: 'cleaning', // Add service type for backend identification
  };

  try {
    // Send booking data to the backend
    const response = await fetch('http://localhost:5000/api/bookings/finalize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error('Failed to save booking');
    }

    const data = await response.json();
    console.log('Booking saved:', data);

    // Navigate to FinalizeCleaning.js
    navigate('/finalize-cleaning');
  } catch (error) {
    console.error('Error submitting booking:', error);
    setMessage('An error occurred while submitting the booking.');
  }
};
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

    const bookings = await CleaningBooking.find({ userId }).populate('handymanId', 'name'); // Fetch bookings for the user
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

module.exports = router;
