// models/Handyman.js
const mongoose = require('mongoose');

const handymanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  city: { 
    type: String, 
    required: true
  },
  skills: [String],
  zipCodes: [String], // Array of zipcodes where the handyman can work
  bio: String,
  verified: {
    type: Boolean,
    default: false
  },
  yearsOfExperience: { // New field for years of experience
    type: Number,
    default: 0,
    min: 0
  },
  profilePicture: String,
  availability: [Date]
});

module.exports = mongoose.model('Handyman', handymanSchema);