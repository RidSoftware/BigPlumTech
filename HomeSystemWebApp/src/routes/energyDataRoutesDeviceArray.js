const express = require('express');
const router = express.Router();
const pool = require('../config/DBPool');

// 
// 24-Hour Energy Data by DeviceID
//  RETURNS ARRAY OF 24 HOUR VALUES
router.post('/api/pull24hrDevice', async (req, res) => {
    let connection;
    try {
        const { deviceID } = req.body;
        if (!deviceID) {
            return res.status(400).json({ success: false, message: 'No deviceID received' });
        }
        
        // Determine the two dates: today and yesterday (or the previous day)
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        now.setDate(now.getDate() - 1);
        const previousDate = now.toISOString().split('T')[0];

        connection = await pool.getConnection();
        console.log('Database connection acquired for /api/pull24hrDevice');

        const query = `
            SELECT Hour, Date, SUM(EnergyVal) AS totalEnergy
            FROM energyhourly
            WHERE DeviceID = ?
            AND (Date = ? OR Date = ?)
            GROUP BY Date, Hour
            ORDER BY Date DESC, Hour ASC
            LIMIT 24;
        `;
        const [energyResults] = await connection.execute(query, [deviceID, currentDate, previousDate]);

        connection.release();
        console.log("SQL energyResults24 for device:", energyResults);

        if (energyResults.length === 0) {
            return res.status(404).json({ success: false, message: 'No energy data found for device' });
        }

        // Process the results to fill all 24 hours (defaulting to 0)
        const energyDayProcessed = {};
        for (let i = 0; i < 24; i++) {
            energyDayProcessed[i] = 0;
        }
        energyResults.forEach(row => {
            energyDayProcessed[row.Hour] = row.totalEnergy !== null ? row.totalEnergy : 0;
        });

        console.log("Processed Energy Data for device:", energyDayProcessed);
        return res.status(200).json({ 
            success: true, 
            message: 'Data pull success for device', 
            twentyfourhr: energyDayProcessed 
        });
    } catch (error) {
        console.error('Error in /api/pull24hrDevice:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
});

// 
// 7-Day Energy Data by DeviceID
//      RETURNS ARRAY OF 7 DAY VALUES
router.post('/api/pull7daysDevice', async (req, res) => {
    let connection;
    try {
        const { deviceID } = req.body;
        if (!deviceID) {
            return res.status(400).json({ success: false, message: 'No deviceID received' });
        }
        
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        now.setDate(now.getDate() - 7);
        const startDate = now.toISOString().split('T')[0];

        connection = await pool.getConnection();
        console.log('Database connection acquired for /api/pull7daysDevice');

        const query = `
            SELECT Date, SUM(EnergyVal) AS totalEnergy
            FROM energydaily
            WHERE DeviceID = ?
            AND Date BETWEEN ? AND ?
            GROUP BY Date
            ORDER BY Date DESC;
        `;
        const [energyResults] = await connection.execute(query, [deviceID, startDate, currentDate]);

        connection.release();
        console.log("SQL energyResults7 for device:", energyResults);

        if (energyResults.length === 0) {
            return res.status(404).json({ success: false, message: 'No energy data found for device' });
        }

        // Process the results into an object keyed by date
        const energyWeekProcessed = {};
        energyResults.forEach(row => {
            const formattedDate = new Date(row.Date).toISOString().split('T')[0];
            energyWeekProcessed[formattedDate] = row.totalEnergy !== null ? row.totalEnergy : 0;
        });

        console.log("Processed Energy Data for device:", energyWeekProcessed);
        return res.status(200).json({ 
            success: true, 
            message: 'Data pull success for device', 
            sevenDays: energyWeekProcessed 
        });
    } catch (error) {
        console.error('Error in /api/pull7daysDevice:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
});

// 
// Hourly Energy Data by DeviceID for a Given Date
//      RETURNS ARAY OVE 24 HOURS FOR ANY DATE GIVEN
router.post('/api/pullHourlyDevice', async (req, res) => {
    let connection;
    try {
        const { deviceID, date } = req.body;
        if (!deviceID || !date) {
            return res.status(400).json({ success: false, message: 'DeviceID and date are required' });
        }

        connection = await pool.getConnection();
        console.log('Database connection acquired for /api/pullHourlyDevice');

        const query = `
            SELECT Hour, Date, SUM(EnergyVal) AS totalEnergy
            FROM energyhourly
            WHERE DeviceID = ?
            AND Date = ?
            GROUP BY Hour, Date
            ORDER BY Hour ASC;
        `;
        const [results] = await connection.execute(query, [deviceID, date]);

        connection.release();

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No energy data found for device on the given date' });
        }

        // Build a complete hourly object (0 to 23) with default values
        const hourlyData = {};
        for (let i = 0; i < 24; i++) {
            hourlyData[i] = 0;
        }
        results.forEach(row => {
            hourlyData[row.Hour] = row.totalEnergy !== null ? row.totalEnergy : 0;
        });

        console.log("Processed Hourly Energy Data for device:", hourlyData);
        return res.status(200).json({ 
            success: true, 
            message: 'Data pull success for device', 
            hourlyData 
        });
    } catch (error) {
        console.error('Error in /api/pullHourlyDevice:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
});

// 
//  Daily Energy Data Range by DeviceID
//      RETURNS ARRAY OF DAY VALUES FROM A RANGE OF 2 DATES GIVEN
router.post('/api/pullDailyRangeDevice', async (req, res) => {
    let connection;
    try {
        const { deviceID, startDate, endDate } = req.body;
        if (!deviceID || !startDate || !endDate) {
            return res.status(400).json({ success: false, message: 'DeviceID, startDate, and endDate are required' });
        }

        connection = await pool.getConnection();
        console.log('Database connection acquired for /api/pullDailyRangeDevice');

        const query = `
            SELECT Date, SUM(EnergyVal) AS totalEnergy
            FROM energydaily
            WHERE DeviceID = ?
            AND Date BETWEEN ? AND ?
            GROUP BY Date
            ORDER BY Date ASC;
        `;
        const [results] = await connection.execute(query, [deviceID, startDate, endDate]);
        connection.release();

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No energy data found for device for the given date range' });
        }

        // Initialize an object for every date between startDate and endDate with 0 as default
        const dailyData = {};
        const currentDateObj = new Date(startDate);
        const finalDateObj = new Date(endDate);
        while (currentDateObj <= finalDateObj) {
            const formattedDate = currentDateObj.toISOString().split('T')[0];
            dailyData[formattedDate] = 0;
            currentDateObj.setDate(currentDateObj.getDate() + 1);
        }

        // Populate the object with results from the query
        results.forEach(row => {
            const formattedDate = new Date(row.Date).toISOString().split('T')[0];
            dailyData[formattedDate] = row.totalEnergy !== null ? row.totalEnergy : 0;
        });

        console.log("Processed Daily Energy Data for device:", dailyData);
        return res.status(200).json({ 
            success: true, 
            message: 'Data pull success for device', 
            dailyData 
        });
    } catch (error) {
        console.error('Error in /api/pullDailyRangeDevice:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;
