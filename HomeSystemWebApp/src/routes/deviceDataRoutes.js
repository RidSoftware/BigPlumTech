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

        console.log("SQL deviceResults:", deviceResults);

        if (deviceResults.length === 0) {
            return res.status(401).json({ success: false, message: 'No devuce data found' });
        }

        const formattedDeviceData = JSON.stringify(deviceResults);

        console.log("Processed Energy Data:", formattedDeviceData);

        return res.status(200).json({ 
            success: true, 
            message: 'datapull success', 
            sentDevices: deviceResults //i was double parsing farmatted results
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
            })
        }

        //have to dynamically create query bsed on what is sent in the put
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
        //i fnothing given other than id then error
        if (updateFields.length === 0) {
            return res.status(400).json({ success: false, message: 'No fields provided for update' });
        }
        //if valid query then add id
        values.push(id);


        connection = await pool.getConnection();
        console.log(`Updating device ${id}`);

        //im proud of this one goddamn
        const dynamicQuery = `
            UPDATE alldevices
            SET ${updateFields.join(", ")}
            WHERE DeviceID = ?
        `;

        //dunno how to debug if this execute fails
        await connection.execute(query, values);
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
router.post('api/addDevice', async (req, res) => {
    let connection;
    try {
        const {name, room, type, status, homeID} = req.body;

        if (status) {
            status = 'On'
        } else {
            status = 'Off'
        }

        if (!name || !room || !type || !homeID) {
            return res.status(400).json({ 
                success: false,
                message: 'need all fields' 
            });
        }

        connection = await pool.getConnection();
        console.log('inserting new deivce');

        const query = `
            INSERT INTO alldevices(DeviceName, LocationRoom, DeviceType, Status, HomeID)
            VALUES (?, ?, ?, ?, ?);
        `;
        await connection.execute(query, [name, room, type, status, homeID]);

        connection.release();

        return res.status(201).json({
            success: true,
            message: 'device added'
        })
    } catch (error) {
        console.error('error in api/addDevice: ', error);
    } finally {
        if (connection) connection.release();
    }
});
////////////// delete device


module.exports = router;
