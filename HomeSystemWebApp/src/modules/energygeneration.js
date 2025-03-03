// modules/energyGeneration.js
const connection = require('../config/db');

// Get energy generation data for daily, weekly, and monthly
const getEnergyGeneration = (deviceId, period, callback) => {
  const query = `SELECT * FROM \`energygeneration (\${period})\` WHERE DeviceID = ?`;
  connection.query(query, [deviceId], callback);
};

module.exports = { getEnergyGeneration };