/////////////THIS IS THE ENERGY API YOU SHOULD IMPORT AND USE ITS FUNCTIONS/////////////////////

///
// fetches 24-hour energy data for a given user THE PREVIOUS 24 HRS NOT AN ARBITRARY DAY
// returns an object with energy values keyed by hour
//
export const syncEnergy24hr = async (userID) => {
    try {
      if (!userID) throw new Error("User ID is required to fetch energy data.");
      const response = await fetch("/api/pull24hr", {
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
  export const syncEnergy7days = async (userID) => {
    try {
      if (!userID) throw new Error("User ID is required to fetch energy data.");
      const response = await fetch("/api/pull7days", {
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
  export const pullDayEnergy = async (userID, date) => {
    try {
      if (!userID || !date) {
        throw new Error("User ID and date are required");
      }
      const response = await fetch("/api/pullHourly", {
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
export const pullDailyEnergyRange = async (userID, startDate, endDate) => {
    try {
      if (!userID || !startDate || !endDate) {
        throw new Error("User ID, startDate, and endDate are required");
      }
      const response = await fetch("/api/pullDailyRange", {
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
  
