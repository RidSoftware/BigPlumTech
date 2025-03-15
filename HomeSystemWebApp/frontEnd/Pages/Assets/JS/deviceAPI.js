///made this file so that devices API can be used anywhere in the front
//will do the same for energy when i can test it on better data
export const getDevices = () => {
    return JSON.parse(localStorage.getItem("devices")) || [];
    //returns the devices stored in local storage
    // in JS ARRAY format... useful
};

export const saveDevices = (devices) => {
    localStorage.setItem("devices", JSON.stringify(devices));
    //save the JS ARRAY into JSON OBJECT in localStorage
};

// fetchs devices from backend and syncs with localStorage NEED TO GIVE IT USERID
export const syncDevicesFromBackend = async (userID) => {
    try {
        if (!userID) {
            throw new Error("User ID is required to fetch devices.");
        }

        const response = await fetch("/api/pullDevices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userID }) 
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);

        saveDevices(JSON.parse(result.sentDevices)); // updates devices obj locallstoraeg
        console.log(`devices synced for User ID ${userID}: `, result.sentDevices);
    } catch (error) {
        console.error(`err syncing devices for User ID ${userID}:`, error);
    }
};

/////update a devices properties in backend
// important to undertsand updatedFields argument
// it is a DYNAMIC OBJECT; meaning you call it w a obj w properties you wanna use
// example call: updateDevice(1, { name: "Smart Light", status: false });
export const updateDevice = async (deviceID, updatedFields) => {
    try {
        const response = await fetch("/api/updateDevice", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: deviceID, ...updatedFields })
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);

        console.log("Device updated successfully:", result);
    } catch (error) {
        console.error("Error updating device:", error);
    }
};

// adds a device to the db
// argment newDevice is an OBJECT
// EXAMPLE CALL;
    // insertDevice({
    //     name: "red light",
    //     room: "Living Room",
    //     info: "Light bulb",
    //     type: "Light",
    //     status: true,
    //     homeID: 56
    // });
export const insertDevice = async (newDevice) => {
    try {
        const response = await fetch("/api/addDevice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newDevice)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);

        console.log("Device added successfully:", result);
    } catch (error) {
        console.error("Error adding device:", error);
    }
};

// ////  Delete a device from backend
export const deleteDeviceBackend = async (deviceID) => {
    try {
        const response = await fetch("/api/deleteDevice", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: deviceID })
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);

        console.log("Device deleted successfully:", result);
    } catch (error) {
        console.error("Error deleting device:", error);
    }
};
