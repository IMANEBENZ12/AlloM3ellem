const mongoose = require('mongoose');

const CleaningBookingSchema = new mongoose.Schema({
  zipCode: { type: String, required: true },
  beds: { type: Number, required: true },
  baths: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  email: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CleaningBooking', CleaningBookingSchema);