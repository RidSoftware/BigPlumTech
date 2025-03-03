// routes/homeroutes.js
const express = require('express');
const router = express.Router();
const homeModel = require('../modules/home');
const connection = require('../config/db');

// Get home details
router.get('/home/:id', (req, res) => {
  const homeID = req.params.id;
  homeModel.getHomeDetails(homeID, (err, result) => {
    if (err) {
      res.status(500).send('Error fetching home details');
    } else {
      res.json(result);
    }
  });
});

// Insert new home details (admin only)
router.post('/addhome', (req, res) => {
  const { NoOfResidents, HomeManager, AdminCode } = req.body;
  homeModel.createHome(NoOfResidents, HomeManager, AdminCode, (err, result) => {
    if (err) {
      res.status(500).send('Error inserting home data');
    } else {
      res.status(200).send('Home added successfully');
    }
  });
});

module.exports = router;