const express = require('express');
const router = express.Router();
const Handyman = require('../models/Handyman');

const zipCodeToCity = {
  '20': 'Casablanca', // Zip codes starting with 20 belong to Casablanca
  '53': 'Ifrane',     // Zip codes starting with 53 belong to Ifrane
  '30': 'Fes',  
  '10': 'Rabat', 
        // Zip codes starting with 30 belong to Fes
};

// Match route
router.get('/match/:zipCode/:serviceType', async (req, res) => {
  const { zipCode, serviceType } = req.params;
  const zipPrefix = zipCode.substring(0, 2); // Extract the first two digits of the zip code
  const city = zipCodeToCity[zipPrefix]; // Map the prefix to a city

  try {
    // Find handymen with the exact zip code and service type
    let handymen = await Handyman.find({
      zipCodes: { $in: [zipCode] },
      skills: serviceType
    });

    // If no exact matches, find handymen with the same zip code prefix
    if (handymen.length === 0) {
      handymen = await Handyman.find({
        zipCodes: { $regex: `^${zipPrefix}` }, // Match zip codes starting with the prefix
        skills: serviceType
      });
    }

    // If still no matches, find handymen in the same city
    if (handymen.length === 0 && city) {
      handymen = await Handyman.find({
        city: city,
        skills: serviceType
      });
    }

    res.status(200).json(handymen);
  } catch (error) {
    console.error('Error fetching matched handymen:', error);
    res.status(500).json({ error: 'Failed to fetch matched handymen' });
  }
});

module.exports = router;