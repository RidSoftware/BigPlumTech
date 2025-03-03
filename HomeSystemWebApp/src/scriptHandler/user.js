// modules/user.js
const connection = require('../config/db');

// Get user info 
const getUserById = (userId, callback) => {
  const query = 'SELECT * FROM userdetails WHERE UserID = ?';
  connection.query(query, [userId], callback);
};

// Insert new user (admin check)
const createUser = (username, password, email, homeID, admin, callback) => {
  const query = 'INSERT INTO userdetails (Username, Password, Email, HomeID, Admin) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [username, password, email, homeID, admin], callback);
};


module.exports = { getUserById, createUser };