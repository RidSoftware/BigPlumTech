const express = require('express');
const router = express.Router();
const pool = require('../config/DBPool');

// -
// Sum of Hourly Energy for a Given Date & DeviceID
// 
// This endpoint returns the total energy consumed on a given date by summing all 24 hourly entries.
// Example request body:
// {
//   "deviceID": 123,
//   "date": "2025-03-16"
// }
router.post('/api/sumDayDevice', async (req, res) => {
    let connection;
    try {
        const { deviceID, date } = req.body;
        if (!deviceID || !date) {
            return res.status(400).json({ success: false, message: 'DeviceID and date are required' });
        }
        
        connection = await pool.getConnection();
        console.log('Database connection acquired for /api/sumHourlyDevice');

        const query = `
            SELECT SUM(EnergyVal) AS dailySum
            FROM energyhourly
            WHERE DeviceID = ? AND Date = ?;
        `;
        const [result] = await connection.execute(query, [deviceID, date]);
        connection.release();

        let dailySum = result[0].dailySum;
        if (dailySum === null) dailySum = 0;

        console.log("Sum of hourly energy for device on", date, ":", dailySum);
        return res.status(200).json({ 
            success: true, 
            message: 'Sum retrieved successfully', 
            dailySum 
        });
    } catch (error) {
        console.error('Error in /api/sumHourlyDevice:', error);
        if (connection) connection.release();
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// 
// Sum of Daily Energy Between Two Dates for a Given DeviceID
// 
// This endpoint returns the total energy consumption over a date range.
// Example request body:
// {
//   "deviceID": 123,
//   "startDate": "2025-03-10",
//   "endDate": "2025-03-16"
// }
router.post('/api/sumRangeDevice', async (req, res) => {
    let connection;
    try {
        const { deviceID, startDate, endDate } = req.body;
        if (!deviceID || !startDate || !endDate) {
            return res.status(400).json({ success: false, message: 'DeviceID, startDate, and endDate are required' });
        }
        
        connection = await pool.getConnection();
        console.log('Database connection acquired for /api/sumDailyRangeDevice');

        const query = `
            SELECT SUM(EnergyVal) AS rangeSum
            FROM energydaily
            WHERE DeviceID = ? AND Date BETWEEN ? AND ?;
        `;
        const [result] = await connection.execute(query, [deviceID, startDate, endDate]);
        connection.release();

        let rangeSum = result[0].rangeSum;
        if (rangeSum === null) rangeSum = 0;

        console.log("Sum of daily energy for device between", startDate, "and", endDate, ":", rangeSum);
        return res.status(200).json({ 
            success: true, 
            message: 'Sum for date range retrieved successfully', 
            rangeSum 
        });
    } catch (error) {
        console.error('Error in /api/sumDailyRangeDevice:', error);
        if (connection) connection.release();
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
