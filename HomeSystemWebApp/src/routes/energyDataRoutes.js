const express = require('express');
const router = express.Router();
const db = require('../config/DBConnection'); 
const mysql = require('mysql2/promise');

////////////////pull 24hr of data to user
router.post('/api/pull24hr', async (req, res) => {
    let connection;
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: 'No email received by route' 
            });
        }

        const d = new Date();
        const currentDate = d.toISOString().split('T')[0];
        const currentHour = d.getHours();
        
        connection = await db.getConnection();

        const [homeIDResults] = await connection.execute(
            'SELECT HomeID FROM userDetails WHERE email = ?;',
            [email]
        );

        if (homeIDResults.length === 0) {
            connection.release();
            return res.status(401).json({ 
                success: false, 
                message: 'No data found in DB from query, homeid from email' 
            });
        }

        const homeID = homeIDResults[0].homeID;

        const q = 'SELECT SUM(EnergyVal) AS totalEnergy FROM energyhourly JOIN alldevices ON energyhourly.DeviceID = alldevices.DeviceID JOIN homedetails ON homedetails.HomeID = alldevices.HomeID WHERE homedetails.HomeID = ? AND energyhourly.Hour = ? AND energyhourly.Date = ?;';
        const q2 = `
            SELECT energyhourly.Hour, SUM(energyhourly.EnergyVal) AS totalEnergy
            FROM energyhourly
            JOIN alldevices ON energyhourly.DeviceID = alldevices.DeviceID
            JOIN homedetails ON homedetails.HomeID = alldevices.HomeID
            WHERE homedetails.HomeID = ? AND energyhourly.Date = ?
            GROUP BY energyhourly.Hour
            ORDER BY energyhourly.Hour ASC;
        `;
        
        const [energyResults] = await connection.execute(query, [homeID, currentDate]);

        connection.release();

        if (results.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'no data found in db from query 24hrs energy' 
            });
        }

        const energyDayProcessed = {};
        energyResults.forEach(row => {
            energyDayProcessed[row.Hour] = row.totalEnergy;
        });

            // success
        return res.status(200).json({ 
            success: true, 
            message: 'datapull success', 
            twentyfourhr: energyDayProcessed
        });


    } catch (error) {
        console.error('err from fetch24:', error);
        res.status(500).json({ 
            success: false, 
        });
    } finally { if (connection) connection.release();}
});
/////////////////pull 24hrs



////////////////test energy data pull
router.get('/energy', (req, res) => {
    db.query('SELECT * FROM energyHourly'/*will need updated to new table name*/, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching energydata');
        } else {
            res.json(results);
        }
    });
});
//////////////////test energy data pull

module.exports = router;
