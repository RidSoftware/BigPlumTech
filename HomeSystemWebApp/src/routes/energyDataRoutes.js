////////////////test energy data pull
// router.get('/energy', (req, res) => {
//     db.query('SELECT * FROM energyHourly'/*will need updated to new table name*/, (err, results) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send('Error fetching energydata');
//         } else {
//             res.json(results);
//         }
//     });
// });
//////////////////test energy data pull

// module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../config/DBPool'); 

router.post('/api/pull24hr', async (req, res) => {
    let connection;
    try {
        const { userID } = req.body;

        if (!userID) {
            return res.status(400).json({ success: false, message: 'No userID received' });
        }

        const now = new Date();
        const currentDate = now.toISOString().split('T')[0]; 
        now.setDate(now.getDate() - 1); 
        const previousDate = now.toISOString().split('T')[0]; 

        connection = await pool.getConnection();
        console.log('pool DataBase connection acquired');


        
        const [homeIDResults] = await connection.execute(
            'SELECT HomeID FROM userdetails WHERE userID = ?;',
            [userID]
        );

        if (homeIDResults.length === 0) {
            connection.release();
            return res.status(401).json({ success: false, message: 'No homeID found' });
        }

        const homeID = homeIDResults[0].HomeID;

        
        const query = `
            SELECT energyhourly.Hour, energyhourly.Date, SUM(energyhourly.EnergyVal) AS totalEnergy
            FROM energyhourly
            JOIN alldevices ON energyhourly.DeviceID = alldevices.DeviceID
            WHERE alldevices.HomeID = ? 
            AND (energyhourly.Date = ? OR energyhourly.Date = ?)
            GROUP BY energyhourly.Date, energyhourly.Hour
            ORDER BY energyhourly.Date DESC, energyhourly.Hour ASC
            LIMIT 24;
        `;
        
        const [energyResults] = await connection.execute(query, [homeID, currentDate, previousDate]);

        connection.release();

        console.log("SQL energyResults24:", energyResults); 

        if (energyResults.length === 0) {
            return res.status(401).json({ success: false, message: 'No energy data found' });
        }

        
        const energyDayProcessed = {};
        for (let i = 0; i < 24; i++) {
            energyDayProcessed[i] = 0; 
        }

        energyResults.forEach(row => {
            energyDayProcessed[row.Hour] = row.totalEnergy !== null ? row.totalEnergy : 0;
        });

        console.log("Processed Energy Data:", energyDayProcessed); 

        return res.status(200).json({ 
            success: true, 
            message: 'datapull success', 
            twentyfourhr: energyDayProcessed
        });

    } catch (error) {
        console.error('? Error from /api/pull24hr:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
});

/////////
router.post('/api/pull7days', async (req, res) => {
    let connection;
    try {
        const { userID } = req.body;

        if (!userID) {
            return res.status(400).json({ success: false, message: 'no user received' });
        }

        const now = new Date();
        const currentDate = now.toISOString().split('T')[0]; 
        now.setDate(now.getDate() - 7); 
        const startDate = now.toISOString().split('T')[0]; 

        connection = await pool.getConnection();
        console.log('Database connection acquired');

        // Get the HomeID for the user
        const [homeIDResults] = await connection.execute(
            'SELECT HomeID FROM userdetails WHERE UserID = ?;',
            [userID]
        );

        if (homeIDResults.length === 0) {
            connection.release();
            return res.status(401).json({ success: false, message: 'No homeID found' });
        }

        const homeID = homeIDResults[0].HomeID;

        // Fetch last 7 days of energy usage
        const query = `
            SELECT energydaily.Date, SUM(energydaily.EnergyVal) AS totalEnergy
            FROM energydaily
            JOIN alldevices ON energydaily.DeviceID = alldevices.DeviceID
            WHERE alldevices.HomeID = ?
            AND energydaily.Date BETWEEN ? AND ?
            GROUP BY energydaily.Date
            ORDER BY energydaily.Date DESC;
        `;

        const [energyResults] = await connection.execute(query, [homeID, startDate, currentDate]);

        connection.release();

        console.log("SQL energyResults7:", energyResults);

        if (energyResults.length === 0) {
            return res.status(401).json({ success: false, message: 'No energy data found' });
        }

        // Initialize a data structure to ensure all 7 days are represented
        const energyWeekProcessed = {};
        for (let i = 0; i < 7; i++) {
            energyWeekProcessed[i] = 0; 
        }

        // Populate energy data
        energyResults.forEach(row => {
            const ProcessedDate = row.Date.toISOString().split('T')[0]
            energyWeekProcessed[row.Date] = row.totalEnergy !== null ? row.totalEnergy : 0;
        });

        console.log("Processed Energy Data:", energyWeekProcessed);

        return res.status(200).json({ 
            success: true, 
            message: 'datapull success', 
            sevenDays: energyWeekProcessed
        });

    } catch (error) {
        console.error('? Error from /api/pull7days:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
});

///////////////now these below are for arbitrary given times

/////puls 24 hour values when gove userID and Date
router.post('/api/pullHourly', async (req, res) => {
    let connection;
    try {
        const { userID, date } = req.body;
        if (!userID || !date) {
            return res.status(400).json({ success: false, message: 'UserID and date are required' });
        }
        
        connection = await pool.getConnection();
        console.log('Database connection acquired for /api/pullHourly');

        // Get the HomeID for the user
        const [homeIDResults] = await connection.execute(
            'SELECT HomeID FROM userdetails WHERE userID = ?;',
            [userID]
        );
        if (homeIDResults.length === 0) {
            connection.release();
            return res.status(401).json({ success: false, message: 'No homeID found' });
        }
        const homeID = homeIDResults[0].HomeID;

        // Query to pull energy data for the given date grouped by hour
        const query = `
            SELECT energyhourly.Hour, energyhourly.Date, SUM(energyhourly.EnergyVal) AS totalEnergy
            FROM energyhourly
            JOIN alldevices ON energyhourly.DeviceID = alldevices.DeviceID
            WHERE alldevices.HomeID = ?
            AND energyhourly.Date = ?
            GROUP BY energyhourly.Hour, energyhourly.Date
            ORDER BY energyhourly.Hour ASC;
        `;
        const [results] = await connection.execute(query, [homeID, date]);
        connection.release();

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No energy data found for the given date' });
        }

        // Prepare a complete hourly object (0-23) with 0 as default
        const hourlyData = {};
        for (let i = 0; i < 24; i++) {
            hourlyData[i] = 0;
        }
        results.forEach(row => {
            hourlyData[row.Hour] = row.totalEnergy !== null ? row.totalEnergy : 0;
        });

        console.log("Processed Hourly Energy Data:", hourlyData);

        return res.status(200).json({ 
            success: true, 
            message: 'Data pull success', 
            hourlyData
        });
    } catch (error) {
        console.error('Error in /api/pullHourly:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
});

// pulls range of day values

router.post('/api/pullDailyRange', async (req, res) => {
    let connection;
    try {
        const { userID, startDate, endDate } = req.body;
        if (!userID || !startDate || !endDate) {
            return res.status(400).json({ success: false, message: 'UserID, startDate, and endDate are required' });
        }
        
        connection = await pool.getConnection();
        console.log('Database connection acquired for /api/pullDailyRange');

        // Get the HomeID for the user
        const [homeIDResults] = await connection.execute(
            'SELECT HomeID FROM userdetails WHERE userID = ?;',
            [userID]
        );
        if (homeIDResults.length === 0) {
            connection.release();
            return res.status(401).json({ success: false, message: 'No homeID found' });
        }
        const homeID = homeIDResults[0].HomeID;

        // Query to pull daily energy data from the energydaily table.
        // If your energydaily table already contains HomeID, you might not need a join.
        const query = `
            SELECT ed.Date, SUM(ed.EnergyVal) AS totalEnergy
            FROM energydaily ed
            JOIN alldevices ad ON ed.DeviceID = ad.DeviceID
            WHERE ad.HomeID = ?
            AND ed.Date BETWEEN ? AND ?
            GROUP BY ed.Date
            ORDER BY ed.Date ASC;
        `;
        const [results] = await connection.execute(query, [homeID, startDate, endDate]);
        connection.release();

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No energy data found for the given date range' });
        }

        // Initialize an object with every date between startDate and endDate with 0 as default.
        const dailyData = {};
        const currentDateObj = new Date(startDate);
        const finalDateObj = new Date(endDate);
        while (currentDateObj <= finalDateObj) {
            const formattedDate = currentDateObj.toISOString().split('T')[0];
            dailyData[formattedDate] = 0;
            currentDateObj.setDate(currentDateObj.getDate() + 1);
        }

        // Populate energy data with formatted dates
        results.forEach(row => {
            const formattedDate = new Date(row.Date).toISOString().split('T')[0];
            dailyData[formattedDate] = row.totalEnergy !== null ? row.totalEnergy : 0;
        });

        console.log("Processed Daily Energy Data:", dailyData);

        return res.status(200).json({ 
            success: true, 
            message: 'Data pull success', 
            dailyData
        });
    } catch (error) {
        console.error("Error in /api/pullDailyRange:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
});











module.exports = router;
