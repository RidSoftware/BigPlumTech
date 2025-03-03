// modules/energyusage.js
const connection = require('../config/db');

// Get energy usage data for daily, weekly, and monthly
const getEnergyUsage = (deviceId, period, callback) => {
  const query = `SELECT * FROM \`energyusage (\${period})\` WHERE DeviceID = ?`;
  connection.query(query, [deviceId], callback);
};

module.exports = { getEnergyUsage };