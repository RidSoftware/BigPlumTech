// routes/energyusageroutes.js
const express = require('express');
const router = express.Router();
const energyUsageModel = require('../modules/energyusage');
const connection = require('../config/db');

// Get energy usage data (daily, weekly, monthly)
router.get('/energyusage/:deviceId/:period', (req, res) => {
  const { deviceId, period } = req.params;
  energyUsageModel.getEnergyUsage(deviceId, period, (err, result) => {
    if (err) {
      res.status(500).send('Error fetching energy usage data');
    } else {
      res.json(result);
    }
  });
});

module.exports = router;