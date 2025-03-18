const express = require('express');
const router = express.Router();
const pool = require('../config/DBPool');

// 
// Sum of Hourly Energy for a Given Date for a User

// This endpoint returns the total energy consumed on a given date by summing all 24-hour entries
// across all devices tied to the user's HomeID.
// Example request body:
// {
//   "userID": 456,
//   "date": "2025-03-16"
// }
router.post('/api/sumDayUser', async (req, res) => {
    let connection;
    try {
        const { userID, date } = req.body;
        if (!userID || !date) {
            return res.status(400).json({ success: false, message: 'UserID and date are required' });
        }
        
        connection = await pool.getConnection();
        console.log('Database connection acquired for /api/sumDayUser');

        // Retrieve the HomeID for the user.
        const [homeIDResults] = await connection.execute(
            'SELECT HomeID FROM userdetails WHERE userID = ?;',
            [userID]
        );
        if (homeIDResults.length === 0) {
            connection.release();
            return res.status(404).json({ success: false, message: 'No homeID found for this user' });
        }
        const homeID = homeIDResults[0].HomeID;

        // Sum the hourly energy values from all devices tied to the user's HomeID
        const query = `
            SELECT SUM(EnergyVal) AS dailySum
            FROM energyhourly
            JOIN alldevices ON energyhourly.DeviceID = alldevices.DeviceID
            WHERE alldevices.HomeID = ? AND energyhourly.Date = ?;
        `;
        const [result] = await connection.execute(query, [homeID, date]);
        connection.release();

        let dailySum = result[0].dailySum;
        if (dailySum === null) dailySum = 0;

        console.log("Sum of hourly energy for user on", date, ":", dailySum);
        return res.status(200).json({ 
            success: true, 
            message: 'Sum retrieved successfully', 
            dailySum 
        });
    } catch (error) {
        console.error('Error in /api/sumDayUser:', error);
        if (connection) connection.release();
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// 
// Sum of Daily Energy Between Two Dates for a User

// This endpoint returns the total energy consumption over a date range across all devices
// tied to the user's HomeID.

// Example request body:
// {
//   "userID": 456,
//   "startDate": "2025-03-10",
//   "endDate": "2025-03-16"
// }
router.post('/api/sumRangeUser', async (req, res) => {
    let connection;
    try {
        const { userID, startDate, endDate } = req.body;
        if (!userID || !startDate || !endDate) {
            return res.status(400).json({ success: false, message: 'UserID, startDate, and endDate are required' });
        }
        
        connection = await pool.getConnection();
        console.log('Database connection acquired for /api/sumRangeUser');

        // Retrieve the HomeID for the user.
        const [homeIDResults] = await connection.execute(
            'SELECT HomeID FROM userdetails WHERE userID = ?;',
            [userID]
        );
        if (homeIDResults.length === 0) {
            connection.release();
            return res.status(404).json({ success: false, message: 'No homeID found for this user' });
        }
        const homeID = homeIDResults[0].HomeID;

        // Sum the daily energy values from the energydaily table for all devices tied to the user's HomeID.
        const query = `
            SELECT SUM(EnergyVal) AS rangeSum
            FROM energydaily
            JOIN alldevices ON energydaily.DeviceID = alldevices.DeviceID
            WHERE alldevices.HomeID = ? AND energydaily.Date BETWEEN ? AND ?;
        `;
        const [result] = await connection.execute(query, [homeID, startDate, endDate]);
        connection.release();

        let rangeSum = result[0].rangeSum;
        if (rangeSum === null) rangeSum = 0;

        console.log("Sum of daily energy for user between", startDate, "and", endDate, ":", rangeSum);
        return res.status(200).json({ 
            success: true, 
            message: 'Sum for date range retrieved successfully', 
            rangeSum 
        });
    } catch (error) {
        console.error('Error in /api/sumRangeUser:', error);
        if (connection) connection.release();
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
