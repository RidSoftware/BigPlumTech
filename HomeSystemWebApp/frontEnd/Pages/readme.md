NOTE on using API.js files in /Assets/JS/

For the html to use the js properly, you need to make scripts type="modules"
![image](https://github.com/user-attachments/assets/876b9eba-459f-4165-afd8-85bfc995ac5f)

And you gotta import them in the js files you wanna use them in:
![image](https://github.com/user-attachments/assets/10f11909-a66b-4c27-a630-cd7d29d3d027)


Energy API Documentation

This document details the functions available in our Energy API. The API is divided into two main sections: User-Based and Device-Based endpoints. Each function is described with its purpose, required input parameters, the backend endpoint it calls, and what it returns.
User-Based Energy API Functions

    syncEnergy24hrUser(userID)
        Purpose:
        Fetches the previous 24-hour energy data for a given user (the previous 24 hours, not an arbitrary day).
        How to Use:
        Pass in a valid userID.
            Input: userID (number)
            Output: An object with 24 key-value pairs (keys: 0–23 representing each hour) containing energy values.
            Storage: Saves the result in localStorage under the key "energyDataDay".
            Endpoint Called: /api/pull24hrUser

    syncEnergy7daysUser(userID)
        Purpose:
        Retrieves energy data for the previous 7 days for the given user (not an arbitrary week).
        How to Use:
        Pass in a valid userID.
            Input: userID (number)
            Output: An object keyed by date with energy totals for each day.
            Storage: Saves the result in localStorage under the key "energyDataWeek".
            Endpoint Called: /api/pull7daysUser

    pullDayEnergyUser(userID, date)
        Purpose:
        Pulls hourly energy data for a specified date for a given user.
        How to Use:
        Provide a valid userID and a date (in "YYYY-MM-DD" format).
            Input:
                userID (number)
                date (string, "YYYY-MM-DD")
            Output: An object with 24 key-value pairs for hourly energy data.
            Endpoint Called: /api/pullHourlyUser
            Note: Does not store data in localStorage.

    pullDailyEnergyRangeUser(userID, startDate, endDate)
        Purpose:
        Pulls daily energy data for a specified date range for a given user.
        How to Use:
        Provide a valid userID, a startDate, and an endDate (both in "YYYY-MM-DD" format).
            Input:
                userID (number)
                startDate (string, "YYYY-MM-DD")
                endDate (string, "YYYY-MM-DD")
            Output: An object keyed by date with energy totals for the range.
            Endpoint Called: /api/pullDailyRangeUser
            Note: Does not store data in localStorage.

    sumDayEnergyUser(userID, date)
        Purpose:
        Sums up the energy values (across all devices tied to the user) for a given day and returns an integer.
        How to Use:
        Provide a valid userID and a date in "YYYY-MM-DD" format.
            Input:
                userID (number)
                date (string, "YYYY-MM-DD")
            Output: An integer representing the total energy for that day.
            Endpoint Called: /api/sumDayUser

    sumRangeEnergyUser(userID, startDate, endDate)
        Purpose:
        Sums the energy values (across all devices tied to the user) over a specified date range and returns an integer.
        How to Use:
        Provide a valid userID, a startDate, and an endDate (both in "YYYY-MM-DD" format).
            Input:
                userID (number)
                startDate (string, "YYYY-MM-DD")
                endDate (string, "YYYY-MM-DD")
            Output: An integer representing the total energy for the date range.
            Endpoint Called: /api/sumRangeUser

Device-Based Energy API Functions

    syncEnergy24hrDevice(deviceID)
        Purpose:
        Fetches the previous 24-hour energy data for a given device (the previous 24 hours, not an arbitrary day).
        How to Use:
        Pass in a valid deviceID.
            Input: deviceID (number)
            Output: An object with 24 key-value pairs (keys: 0–23 representing each hour) containing energy values.
            Storage: Saves the result in localStorage under the key "energyDataDayDevice".
            Endpoint Called: /api/pull24hrDevice

    syncEnergy7daysDevice(deviceID)
        Purpose:
        Retrieves energy data for the previous 7 days for a given device (not an arbitrary week).
        How to Use:
        Pass in a valid deviceID.
            Input: deviceID (number)
            Output: An object keyed by date with energy totals for each day.
            Storage: Saves the result in localStorage under the key "energyDataWeekDevice".
            Endpoint Called: /api/pull7daysDevice

    pullDayEnergyDevice(deviceID, date)
        Purpose:
        Pulls hourly energy data for a specified date for a given device.
        How to Use:
        Provide a valid deviceID and a date (in "YYYY-MM-DD" format).
            Input:
                deviceID (number)
                date (string, "YYYY-MM-DD")
            Output: An object with 24 key-value pairs for hourly energy data.
            Endpoint Called: /api/pullHourlyDevice
            Note: Does not store data in localStorage.

    pullDailyEnergyRangeDevice(deviceID, startDate, endDate)
        Purpose:
        Pulls daily energy data for a specified date range for a given device.
        How to Use:
        Provide a valid deviceID, a startDate, and an endDate (both in "YYYY-MM-DD" format).
            Input:
                deviceID (number)
                startDate (string, "YYYY-MM-DD")
                endDate (string, "YYYY-MM-DD")
            Output: An object keyed by date with energy totals for the range.
            Endpoint Called: /api/pullDailyRangeDevice
            Note: Does not store data in localStorage.

    sumDayEnergyDevice(deviceID, date)
        Purpose:
        Sums up the hourly energy values for a given device on a specified date, returning an integer.
        How to Use:
        Provide a valid deviceID and a date (in "YYYY-MM-DD" format).
            Input:
                deviceID (number)
                date (string, "YYYY-MM-DD")
            Output: An integer representing the total energy for that day.
            Endpoint Called: /api/sumDayDevice

    sumRangeEnergyDevice(deviceID, startDate, endDate)
        Purpose:
        Sums the energy values for a given device over a specified date range and returns an integer.
        How to Use:
        Provide a valid deviceID, a startDate, and an endDate (both in "YYYY-MM-DD" format).
            Input:
                deviceID (number)
                startDate (string, "YYYY-MM-DD")
                endDate (string, "YYYY-MM-DD")
            Output: An integer representing the total energy for the date range.
            Endpoint Called: /api/sumRangeDevice
