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
      return result.twentyfourhr;
    } catch (error) {
      console.error("Error syncing 24hr energy data:", error);
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
      return result.sevenDays;
    } catch (error) {
      console.error("Error syncing 7-day energy data:", error);
    }
  };
  


  /////////////////// FOR ARBITRARY MONTH WEEK DAY

  