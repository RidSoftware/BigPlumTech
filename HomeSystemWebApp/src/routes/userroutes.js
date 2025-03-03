// routes/userroutes.js
const express = require('express');
const router = express.Router();
const userModel = require('../modules/user');
const connection = require('../config/db');

// Get user by ID
router.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  userModel.getUserById(userId, (err, result) => {
    if (err) {
      res.status(500).send('Error fetching user data');
    } else {
      res.json(result);
    }
  });
});

//need to fix this////

// Create a new user (admin only)
router.post('/adduser', (req, res) => {
  const { Username, Password, Email, HomeID, Admin } = req.body;
  userModel.createUser(Username, Password, Email, HomeID, Admin, (err, result) => {
    if (err) {
      res.status(500).send('Error inserting user data');
    } else {
      res.status(200).send('User added successfully');
    }
  });
});

module.exports = router;