const express = require('express');
const router = express.Router();
const pool = require('../config/DBPool'); 

///////// pull devices
router.post('/api/pullDevices', async (req, res) => {
    let connection;
    try {
        const { userID } = req.body;

        if (!userID) {
            return res.status(400).json({ success: false, message: 'no user received' });
        }

        connection = await pool.getConnection();
        // console.log('pullDevices Database connection acquired');

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

        const queryFancy = `
            SELECT 
            DeviceID AS id, 
            DeviceName AS name, 
            LocationRoom AS room, 
            'blank' AS info, 
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
;

        if (deviceResults.length === 0) {
            return res.status(401).json({ success: false, message: 'No device data found' });
        }

        const formattedDeviceResults = deviceResults.map(device => ({
            ...device,
            status: device.status === 1 // Convert 1 to true, 0 to false
        }));

        return res.status(200).json({ 
            success: true, 
            message: 'datapull success', 
            sentDevices: formattedDeviceResults
        });

    } catch (error) {
        console.error('? Error from /api/pullDevices:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
});

////////////////////  update devices
router.put('/api/updateDevice', async (req, res) => {
    let connection;
    try {
        const {id, name, room, type, status, location} = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'device ID not recieved'
            });
        }

        //have to dynamically create query based on what is sent in the put
        let updateFields = [];
        let values = [];

        if (name) {
            updateFields.push("DeviceName = ?");
            values.push(name);
        }
        if (room) {
            updateFields.push("LocationRoom = ?");
            values.push(room);
        }
        if (type) {
            updateFields.push("DeviceType = ?");
            values.push(type);
        }
        if (status !== undefined) {  // Ensure `false` values are also considered
            updateFields.push("Status = ?");
            values.push(status ? 'On' : 'Off');
        }
        //if nothing given other than id then error
        if (updateFields.length === 0) {
            return res.status(400).json({ success: false, message: 'No fields provided for update' });
        }
        //if valid query then add id
        values.push(id);

        connection = await pool.getConnection();
        console.log(`Updating device ${id}`);

        const dynamicQuery = `
            UPDATE alldevices
            SET ${updateFields.join(", ")}
            WHERE DeviceID = ?
        `;

        // Fixed: using dynamicQuery instead of query
        await connection.execute(dynamicQuery, values);
        connection.release();

        return res.status(200).json({ 
            success: true, 
            message: 'device updated' 
        });
   
    } catch (error) {
        console.error('Error in /api/updateDevice:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
});

////////////////////// add device
router.post('/api/addDevice', async (req, res) => {  // Fixed: Added leading slash
    let connection;
    try {
        const {name, room, type, status, homeID} = req.body;

        // Fixed: Don't modify the const parameter
        const statusValue = status ? 'On' : 'Off';

        if (!name || !room || !type || !homeID) {
            return res.status(400).json({ 
                success: false,
                message: 'need all fields' 
            });
        }

        connection = await pool.getConnection();
        console.log('inserting new device');

        const query = `
            INSERT INTO alldevices(DeviceName, LocationRoom, DeviceType, Status, HomeID)
            VALUES (?, ?, ?, ?, ?);
        `;

        const [result] = await connection.execute(query, [name, room, type, statusValue, homeID]);
        const deviceId = result.insertId;

        connection.release();

        // Return the created device with its ID for frontend use
        return res.status(201).json({
            success: true,
            message: 'device added',
            device: {
                id: deviceId,
                name,
                room,
                type,
                status: status ? true : false,
                info: 'blank',
                homeID
            }
        });
    } catch (error) {
        console.error('error in /api/addDevice: ', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
});

////////////// delete device
router.delete('/api/deleteDevice', async (req, res) => {  // Fixed: Changed from POST to DELETE
    let connection;
    try {
        const {id} = req.body;

        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: 'no devid given' 
            });
        }

        connection = await pool.getConnection();
        console.log(`deleting device, id: ${id}`);

        const query = `
            DELETE FROM alldevices 
            WHERE DeviceID = ?
        `;

        await connection.execute(query, [id]);
        connection.release();

        return res.status(200).json({
            success: true,
            message: 'successful delete'
        });

    } catch (error) {
        console.error('error in /api/deleteDevice: ', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;