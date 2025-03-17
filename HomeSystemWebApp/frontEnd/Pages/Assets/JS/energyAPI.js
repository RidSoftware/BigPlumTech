/////////////THIS IS THE ENERGY API YOU SHOULD IMPORT AND USE ITS FUNCTIONS/////////////////////

///
// fetches 24-hour energy data for a given user THE PREVIOUS 24 HRS NOT AN ARBITRARY DAY
// returns an object with energy values keyed by hour
//
export const syncEnergy24hrUser = async (userID) => {
    try {
      if (!userID) throw new Error("User ID is required to fetch energy data.");
      const response = await fetch("/api/pull24hrUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      console.log("24-hour energy data synced:", result.twentyfourhr);
      localStorage.setItem("energyDataDay", JSON.stringify(result.twentyfourhr));
      return result.twentyfourhr;
    } catch (error) {
      console.error("Error syncing 24hr energy data:", error);
      localStorage.setItem("energyDataDay", JSON.stringify({}));
      return {};
    }
  };
  
//fetches 7-day energy data for a given user, THE PREVIOUS & DAYS NOT AN ARBITRARY WEEK
//   returns an object with energy totals from date
///
  export const syncEnergy7daysUser = async (userID) => {
    try {
      if (!userID) throw new Error("User ID is required to fetch energy data.");
      const response = await fetch("/api/pull7daysUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      console.log("7-day energy data synced:", result.sevenDays);
      localStorage.setItem("energyDataWeek", JSON.stringify(result.sevenDays));
      return result.sevenDays;
    } catch (error) {
      console.error("Error syncing 7-day energy data:", error);
      localStorage.setItem("energyDataWeek", JSON.stringify({}));
      return {};
    }
  };
  


  /////////////////// FOR ARBITRARY MONTH WEEK DAY

  /**
 * pulls hourly energy data for a given date.
 * Expects an object with:
 * {
 *   userID: number,
 *   date: "YYYY-MM-DD"
 * }
 *      doesnt add item to local storage
 */
  export const pullDayEnergyUser = async (userID, date) => {
    try {
      if (!userID || !date) {
        throw new Error("User ID and date are required");
      }
      const response = await fetch("/api/pullHourlyUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID, date }),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }

      console.log("Hourly energy data pulled:", result.hourlyData);
      return result.hourlyData;
    } catch (error) {
      console.error("Error pulling hourly energy data:", error);
      return {};
    }
  };


  /**
 * pulls daily energy data between two dates.
 * Expects an object with:
 * {
 *   userID: number,
 *   startDate: "YYYY-MM-DD",
 *   endDate: "YYYY-MM-DD"
 * }
 * doesnt add item to local storage
 */
///useful for pulling a week and month etc
export const pullDailyEnergyRangeUser = async (userID, startDate, endDate) => {
    try {
      if (!userID || !startDate || !endDate) {
        throw new Error("User ID, startDate, and endDate are required");
      }
      const response = await fetch("/api/pullDailyRangeUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID, startDate, endDate }),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
      
      console.log("Daily energy data range pulled:", result.dailyData);
      return result.dailyData;
    } catch (error) {
      console.error("Error pulling daily energy data range:", error);
      
      return {};
    }
  };
  
/////////////////////

/////////////////THIS IS THE ENERGY API YOU SHOULD IMPORT AND USE ITS FUNCTIONS/////////////////////

//
// fetches 24‑hour energy data for a given device (previous 24 hrs, not an arbitrary day)
// returns an object with energy values keyed by hour
//
export const syncEnergy24hrDevice = async (deviceID) => {
    try {
      if (!deviceID) throw new Error("Device ID is required to fetch energy data.");
      const response = await fetch("/api/pull24hrDevice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceID }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      console.log("24‑hour energy data for device synced:", result.twentyfourhr);
      localStorage.setItem("energyDataDayDevice", JSON.stringify(result.twentyfourhr));
      return result.twentyfourhr;
    } catch (error) {
      console.error("Error syncing 24hr energy data for device:", error);
      localStorage.setItem("energyDataDayDevice", JSON.stringify({}));
      return {};
    }
  };
  
  //
  // fetches 7‑day energy data for a given device (previous 7 days, not an arbitrary week)
  // returns an object with energy totals keyed by date
  //
  export const syncEnergy7daysDevice = async (deviceID) => {
    try {
      if (!deviceID) throw new Error("Device ID is required to fetch energy data.");
      const response = await fetch("/api/pull7daysDevice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceID }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      console.log("7‑day energy data for device synced:", result.sevenDays);
      localStorage.setItem("energyDataWeekDevice", JSON.stringify(result.sevenDays));
      return result.sevenDays;
    } catch (error) {
      console.error("Error syncing 7‑day energy data for device:", error);
      localStorage.setItem("energyDataWeekDevice", JSON.stringify({}));
      return {};
    }
  };
  
  //
  // pulls hourly energy data for a given date for a device.
  // Expects an object with:
  // {
  //   deviceID: number,
  //   date: "YYYY-MM-DD"
  // }
  // Does not add the result to local storage
  //
  export const pullDayEnergyDevice = async (deviceID, date) => {
    try {
      if (!deviceID || !date) {
        throw new Error("Device ID and date are required");
      }
      const response = await fetch("/api/pullHourlyDevice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceID, date }),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
      console.log("Hourly energy data for device pulled:", result.hourlyData);
      return result.hourlyData;
    } catch (error) {
      console.error("Error pulling hourly energy data for device:", error);
      return {};
    }
  };
  
  //
  // pulls daily energy data between two dates for a device.
  // Expects an object with:
  // {
  //   deviceID: number,
  //   startDate: "YYYY-MM-DD",
  //   endDate: "YYYY-MM-DD"
  // }
  // Does not add the result to local storage
  //
  export const pullDailyEnergyRangeDevice = async (deviceID, startDate, endDate) => {
    try {
      if (!deviceID || !startDate || !endDate) {
        throw new Error("Device ID, startDate, and endDate are required");
      }
      const response = await fetch("/api/pullDailyRangeDevice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceID, startDate, endDate }),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
      console.log("Daily energy data range for device pulled:", result.dailyData);
      return result.dailyData;
    } catch (error) {
      console.error("Error pulling daily energy data range for device:", error);
      return {};
    }
  };
  