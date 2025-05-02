// filepath: c:\HandyMan_Tests\app-test-2\backend\models\Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  handymanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Handyman', required: false }, // Reference to the handyman
  serviceType: { type: String, required: true }, // e.g., "plumbing", "electrical"
  date: { type: String, required: true }, // Booking date
  time: { type: String, required: true }, // Booking time
  zipCode: { type: String, required: true }, // User's zip code
  price: { type: Number, required: false }, // Booking price
  hours: { type: Number, required: true, default: 1 },
  rating: { type: Number, default: null }, // Add rating field
  comment: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the booking was created
});

module.exports = mongoose.model('Booking', BookingSchema);