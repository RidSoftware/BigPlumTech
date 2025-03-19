const mysql = require('mysql2/promise');
const pool = require('../config/DBPool'); 
const schedule = require("node-schedule");

async function liveHourlyUpdates() {
    const connection = await pool.getConnection();

    try {

        const checkDeviceOn = `
            SELECT DeviceID, DeviceType FROM alldevices WHERE Status = 'On'
        `

        const checkDeviceOff = `
            SELECT DeviceID, DeviceType FROM alldevices WHERE Status = 'Off'
        `

        const insertEnergyHourly = `
            INSERT INTO energyhourly (DeviceID, EnergyVal, Hour, Date) VALUES (DeviceID, ?, ?, ?)
        `

        const [onlineDevices] = await connection.execute(checkDeviceOn);
        const [offlineDevices] = await connection.execute(checkDeviceOff);
        
        // Time variables to collect what the current date is
        const currentTime = new Date();

        // Retrieves the current hour
        const currentHour = currentTime.getHours();

        //Since the time is stored in ISO format, this removes everything past the T and stores YYYY-MM-DD into the date constant
        const fixedTime = currentTime.toISOString().split("T")
        const date = fixedTime[0];

        if (onlineDevices.length == 0) {

            for(const { DeviceID } of offlineDevices) {
                await connection.execute(insertEnergyHourly, [DeviceID, 0.0, currentHour, date]);
            }

        } else {


        // This commented code was for implementing device types but is currently being ignored
        /*    const deviceTypes = onlineDevices.map(onlineDevice => onlineDevice.DeviceType);

        /   for(const { DeviceType } of deviceTypes) {

                if (DeviceType = "") {

                }

            } */
        
            for (const { DeviceID } of  onlineDevices) {
                let min = 0.1;
                let max = 0.5;
     
                let randomVal = Math.random() * (max - min) + min;
                randomVal = Math.round(randomVal * 100) / 100;

                await connection.execute(insertEnergyHourly, [DeviceID, randomVal, currentHour, date]);
            }

            for (const { DeviceID } of  offlineDevices) {
                await connection.execute(insertEnergyHourly, [DeviceID, 0.0, currentHour, date]);
            }
            
        }

    } catch {
        console.error("System failed to update energy records with live information")
    } finally {
        connection.release();
    }

schedule.scheduleJob("0 * * * *", liveHourlyUpdates);
}