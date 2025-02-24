// routes/deviceroutes.js
const express = require('express');
const router = express.Router();
const deviceModel = require('../modules/alldevices');
const connection = require('../config/db');

// Get all devices
router.get('/devices', (req, res) => {
  deviceModel.getAllDevices((err, result) => {
    if (err) {
      res.status(500).send('Error fetching devices');
    } else {
      res.json(result);
    }
  });
});

// Insert a new device (admin only)
router.post('/adddevice', (req, res) => {
  const { DeviceName, DeviceType, Status, Location, HomeID } = req.body;
  deviceModel.createDevice(DeviceName, DeviceType, Status, Location, HomeID, (err, result) => {
    if (err) {
      res.status(500).send('Error inserting device');
    } else {
      res.status(200).send('Device added successfully');
    }
  });
});

module.exports = router;