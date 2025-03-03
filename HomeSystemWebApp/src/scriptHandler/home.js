// modules/home.js
const connection = require('../config/db');

// Get home details
const getHomeDetails = (homeID, callback) => {
  const query = 'SELECT * FROM homedetails WHERE HomeID = ?';
  connection.query(query, [homeID], callback);
};

// Insert new home details (admin only)
const createHome = (noOfResidents, homeManager, adminCode, callback) => {
  const query = 'INSERT INTO homedetails (NoOfResidents, HomeManager, AdminCode) VALUES (?, ?, ?)';
  connection.query(query, [noOfResidents, homeManager, adminCode], callback);
};

module.exports = { getHomeDetails, createHome };