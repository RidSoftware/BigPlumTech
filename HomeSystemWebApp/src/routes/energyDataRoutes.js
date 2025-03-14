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
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'No email received' });
        }

        const now = new Date();
        const currentDate = now.toISOString().split('T')[0]; 
        now.setDate(now.getDate() - 1); 
        const previousDate = now.toISOString().split('T')[0]; 

        connection = await pool.getConnection();
        console.log('pool DataBase connection acquired');


        
        const [homeIDResults] = await connection.execute(
            'SELECT HomeID FROM userdetails WHERE email = ?;',
            [email]
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
            ORDER BY energyhourly.Date DESC, energyhourly.Hour DESC
            LIMIT 24;
        `;
        
        const [energyResults] = await connection.execute(query, [homeID, currentDate, previousDate]);

        connection.release();

        console.log("SQL Results:", energyResults); 

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

module.exports = router;
