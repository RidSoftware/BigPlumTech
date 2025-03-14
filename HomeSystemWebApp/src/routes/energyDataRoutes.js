// const express = require('express');
// const router = express.Router();
// const db = require('../config/DBConnection'); 
// const pool = require('../config/DBPool')
// const mysql = require('mysql2/promise');

// ////////////////pull 24hr of data to user
// router.post('/api/pull24hr', async (req, res) => {
//     let connection;
//     try {
//         const { email } = req.body;

//         if (!email) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'No email received by route' 
//             });
//         }

//         const d = new Date();
//         const currentDate = d.toISOString().split('T')[0];
//         const currentHour = d.getHours();
        
//         connection = await pool.getConnection();

//         const [homeIDResults] = await connection.execute(
//             'SELECT HomeID FROM userdetails WHERE email = ?;',
//             [email]
//         );

//         if (homeIDResults.length === 0) {
//             connection.release();
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'No data found in DB from query, homeid from email' 
//             });
//         }

//         const homeID = homeIDResults[0].HomeID;

//         const q = 'SELECT SUM(EnergyVal) AS totalEnergy FROM energyhourly JOIN alldevices ON energyhourly.DeviceID = alldevices.DeviceID JOIN homedetails ON homedetails.HomeID = alldevices.HomeID WHERE homedetails.HomeID = ? AND energyhourly.Hour = ? AND energyhourly.Date = ?;';
//         const q2 = `
//             SELECT energyhourly.Hour, SUM(energyhourly.EnergyVal) AS totalEnergy
//             FROM energyhourly
//             JOIN alldevices ON energyhourly.DeviceID = alldevices.DeviceID
//             JOIN homedetails ON homedetails.HomeID = alldevices.HomeID
//             WHERE homedetails.HomeID = ? AND energyhourly.Date = ?
//             GROUP BY energyhourly.Hour
//             ORDER BY energyhourly.Hour ASC;
//         `;
        
//         const [energyResults] = await connection.execute(q2, [homeID, currentDate]);
//         console.log("query results: ", energyResults);
//         connection.release();

//         if (energyResults.length === 0) {
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'no data found in db from query 24hrs energy',
//                 length: energyResults.length,
//                 data: energyResults
//             });
//         }


//         const energyDayProcessed = {};
//         for (let i = 0; i < 24; i++) {
//             energyDayProcessed[i] = 0; // 0 if no data is found
//         }

  
//         energyResults.forEach(row => {
//             energyDayProcessed[row.Hour] = row.totalEnergy;
//         });

//         //console.log(energyDayProcessed);
//             // success
//         return res.status(200).json({ 
//             success: true, 
//             message: 'datapull success', 
//             twentyfourhr: energyDayProcessed
//         });


//     } catch (error) {
//         console.error('err from fetch24:', error);
//         res.status(500).json({ 
//             success: false, 
//         });
//     } finally { if (connection) connection.release();}
// });
// /////////////////pull 24hrs



// ////////////////test energy data pull
// // router.get('/energy', (req, res) => {
// //     db.query('SELECT * FROM energyHourly'/*will need updated to new table name*/, (err, results) => {
// //         if (err) {
// //             console.error(err);
// //             res.status(500).send('Error fetching energydata');
// //         } else {
// //             res.json(results);
// //         }
// //     });
// // });
// //////////////////test energy data pull

// module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../config/DBPool'); // Ensure using the correct DB pool connection

router.post('/api/pull24hr', async (req, res) => {
    let connection;
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'No email received' });
        }

        const now = new Date();
        const currentDate = now.toISOString().split('T')[0]; // Today's date
        now.setDate(now.getDate() - 1); // Go back one day
        const previousDate = now.toISOString().split('T')[0]; // Yesterday's date

        connection = await pool.getConnection();

        // Step 1: Get homeID from user email
        const [homeIDResults] = await connection.execute(
            'SELECT HomeID FROM userdetails WHERE email = ?;',
            [email]
        );

        if (homeIDResults.length === 0) {
            connection.release();
            return res.status(401).json({ success: false, message: 'No homeID found' });
        }

        const homeID = homeIDResults[0].HomeID;

        // Step 2: Query for last 24 hours of energy data (current & previous day)
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

        console.log("Raw SQL Results:", energyResults); // Debugging log

        if (energyResults.length === 0) {
            return res.status(401).json({ success: false, message: 'No energy data found' });
        }

        // Step 3: Fill in All 24 Hours Properly
        const energyDayProcessed = {};
        for (let i = 0; i < 24; i++) {
            energyDayProcessed[i] = 0; // Default to 0 if no data
        }

        energyResults.forEach(row => {
            energyDayProcessed[row.Hour] = row.totalEnergy !== null ? row.totalEnergy : 0;
        });

        console.log("Processed Energy Data:", energyDayProcessed); // Debugging log

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
