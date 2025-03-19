// This module periodically fetches:
//  Carbon intensity data --- National Grid Carbon Intensity API
//  Retail energy cost --- Octopus Energy’s Agile Tariff API
//
// it exports a functions to provide periodic updates 
// and to retrieve the uptodate data
//
//   const energyService = require('./energyService');
//   energyService.start(); // Begin periodic data fetching
//
//   // Later, when you need the latest data:
//   const data = energyService.getEnergyData();
//   console.log(data);
//

const axios = require('axios');

// Object to store the latest fetched data
let energyData = {
  carbonIntensity: null,  // 
  retailEnergyCost: null, // in GBP per kWh usualy like .25 or smthn
  lastUpdated: null
};


// Fetch carbon intensity data from the National Grid API.
//
async function fetchCarbonData() {
  try {
    const response = await axios.get('https://api.carbonintensity.org.uk/intensity');
    if (response.data && response.data.data && response.data.data.length > 0) {
      // extract only the actual carbon intensity value
      const actualValue = response.data.data[0].intensity.actual;
      energyData.carbonIntensity = actualValue;
    }
  } catch (error) {
    console.error('Error fetching carbon intensity data:', error.message);
  }
}




// Fetches Agile tariff rate from Octopus Energy
// The API returns half-hourly rates in pence per kWh, which we convert to GBP per kWh
async function fetchRetailEnergyCost() {
  try {
    const endpoint = 'https://api.octopus.energy/v1/products/AGILE-FLEX-22-11-25/electricity-tariffs/E-1R-AGILE-FLEX-22-11-25-C/standard-unit-rates/';
    const response = await axios.get(endpoint);
    
    if (response.data && response.data.results && Array.isArray(response.data.results) && response.data.results.length > 0) {
      // Find the record with the most recent valid_from value.
      const latestRecord = response.data.results.reduce((latest, current) => {
        return (new Date(current.valid_from) > new Date(latest.valid_from)) ? current : latest;
      }, response.data.results[0]);
      
      // Convert from pence to GBP.
      energyData.retailEnergyCost = latestRecord.value_inc_vat / 100;
      console.log('Most recent Agile tariff record:', latestRecord);
    } else {
      console.warn('Unexpected structure from Octopus API; using fallback value.');
      energyData.retailEnergyCost = 0.20;
    }
  } catch (error) {
    console.error('Error fetching agile energy cost data:', error.message);
    energyData.retailEnergyCost = 0.20;
  }
}


// Update both carbon and retail energy cost data concurrently.
async function updateEnergyData() {
  await Promise.all([fetchCarbonData(), fetchRetailEnergyCost()]);
  energyData.lastUpdated = new Date().toISOString();
  console.log('Updated energy data:', energyData);
}

let intervalId = null;

// starts periodic data fetching
// intervalMinutes  - the update interval in minutes once evry 10 mins
function start(intervalMinutes = 10) {
  //fisrt update
  updateEnergyData();
  const updateInterval = intervalMinutes * 60 * 1000;
  intervalId = setInterval(updateEnergyData, updateInterval);
}


// Stop periodic data fetching.
//
function stop() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

//returns energyCost kW/H
function getEnergyCost() {
  return energyData.retailEnergyCost;
}
function getCarbonIntensity() {
  return energyData.carbonIntensity;
}

module.exports = {
  start,
  stop,
  updateEnergyData,
  getEnergyCost,
  getCarbonIntensity
};
