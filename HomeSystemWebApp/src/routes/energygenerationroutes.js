// routes/energygenerationroutes.js
const express = require('express');
const router = express.Router();
const energyGenerationModel = require('../modules/energygeneration');
const connection = require('../config/db');

// Get energy generation data (daily, weekly, monthly)
router.get('/energygen/:deviceId/:period', (req, res) => {
  const { deviceId, period } = req.params;
  energyGenerationModel.gegEnergygeneration(deviceId, period, (err, result) => {
    if (err) {
      res.status(500).send('Error fetching energy generation data');
    } else {
      res.json(result);
    }
  });
});

module.exports = router;