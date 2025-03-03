// modules/alldevice.js
const connection = require('../config/db');

// Get all devices
const getAllDevices = (callback) => {
  const query = 'SELECT * FROM alldevices';
  connection.query(query, callback);
};

// Insert a device (only for admins)
const createDevice = (deviceName, deviceType, status, location, homeID, callback) => {
  const query = 'INSERT INTO alldevices (DeviceName, DeviceType, Status, `Location/Room`, HomeID) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [deviceName, deviceType, status, location, homeID], callback);
};

module.exports = { getAllDevices, createDevice };