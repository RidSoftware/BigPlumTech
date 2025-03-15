const express = require('express');
const router = express.Router();
const pool = require('../config/DBPool'); 



/////////
router.post('/api/pullDevices', async (req, res) => {
    let connection;
    try {
        const { userID } = req.body;

        if (!userID) {
            return res.status(400).json({ success: false, message: 'no user received' });
        }


        connection = await pool.getConnection();
        console.log('pullDevices Database connection acquired');

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

        // gets all devIDs from a homes
        const [devIDs] = await connection.execute(
            'SELECT DeviceID FROM alldevices WHERE HomeID = ?;',
            [homeID]
        );

        //query to pull all device details
        const query = `
            SELECT *
            FROM alldevices
            WHERE homeID = ?;
        `;
        const queryFancy = `
            SELECT 
            DeviceID AS id, 
            DeviceName AS name, 
            LocationRoom AS room, 
            'Default info' AS info, 
            DeviceType AS type, 
            CASE 
                WHEN Status = 'On' THEN true 
                ELSE false 
            END AS status
            FROM alldevices
            WHERE HomeID = ?
        `;

        const [deviceResults] = await connection.execute(queryFancy, [homeID]);

        connection.release();

        console.log("SQL deviceResults:", deviceResults);

        if (deviceResults.length === 0) {
            return res.status(401).json({ success: false, message: 'No devuce data found' });
        }

        const formattedDeviceData = JSON.stringify(deviceResults);

        console.log("Processed Energy Data:", formattedDeviceData);

        return res.status(200).json({ 
            success: true, 
            message: 'datapull success', 
            sentDevices: formattedDeviceData
        });

    } catch (error) {
        console.error('? Error from /api/pull7days:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
});




module.exports = router;
