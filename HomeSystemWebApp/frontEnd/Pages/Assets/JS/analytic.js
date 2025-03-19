// Import the necessary API functions
import { 
  syncEnergy24hrUser, 
  syncEnergy7daysUser, 
  pullDailyEnergyRangeUser,
  energyGrid
} from './energyAPI.js';
energyGrid();
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize clock and update it every second
  updateTime();
  setInterval(updateTime, 1000);
  // Fetch user ID from local storage or use default
  const userID = localStorage.getItem('userID') || 1;
  
  // Fetch energy data
  const energyData24hr = await syncEnergy24hrUser(userID);
  const energyData7days = await syncEnergy7daysUser(userID);
  
  // Update UI with fetched data
  updateCurrentEnergyStats(energyData24hr);
  getBestEnergyTime(energyData24hr);
  setupEnergyChart(energyData7days, userID);
});

/**
 * Updates the current time display
 */
function updateTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const isAm = hours < 12;
  const displayHour = hours % 12 || 12;
  const displayMin = minutes < 10 ? '0' + minutes : minutes;
  const amPm = isAm ? 'AM' : 'PM';
  const timeString = `${displayHour}:${displayMin} ${amPm}`;
  document.getElementById('currentTime').textContent = timeString;
}

window.updateCurrentEnergyStats = function(energyData24hr) {
  console.log("updateCurrentEnergyStats function is running...");

  //  check sif energyCost exists in local storage
  if (!localStorage.getItem('energyCost')) {
    localStorage.setItem('energyCost', 1);
    console.log("energyCost was missing; set to default 1");
  }

  // Retrieve energy cost and calculate total daily usage
  let energyCost = parseFloat(localStorage.getItem('energyCost'));
  const totalUsage = Object.values(energyData24hr).reduce((sum, value) => sum + parseFloat(value), 0);
  console.log("Total Usage for 24hrs:", totalUsage);

  /// last recorded value from energyData24hr as the current power
    const lastHr = Object.keys(energyData24hr).sort().pop();
    const currentPower = energyData24hr[lastHr];


  if (!localStorage.getItem('carbonIntensity')) {
    console.log("carbonIntensity not in local storage");
  }
  const carbonIntensity = localStorage.getItem('carbonIntensity');

  // energy stuff elements after a short delay because its weird
  setTimeout(() => {
    // Update currentPower display
    const currentPowerElement = document.getElementById('currentPower');
    if (currentPowerElement) {
      currentPowerElement.textContent = `${currentPower} kW`;
    } else {
      console.error("currentPower element not found in the DOM!");
    }
    
    // Update dailyUsage display
    const dailyUsageElement = document.getElementById('dailyUsage');
    if (dailyUsageElement) {
      dailyUsageElement.textContent = `${dailyUsageValue} kWh`;
    } else {
      console.error("dailyUsage element not found in the DOM!");
    }
    
    // estimatedCost display using the energy cost multiplier
    const costElement = document.getElementById('estimatedCost');
    if (costElement) {
      const estimatedCost = totalUsage * energyCost;
      costElement.textContent = `£${estimatedCost.toFixed(2)}`;
    } else {
      console.error("estimatedCost element not found in the DOM!");
    }
    
    // carbonIntensity display
    const carbonIntensityElement = document.getElementById('carbonIntensity');
    if (carbonIntensityElement) {
      carbonIntensityElement.textContent = `${carbonIntensity} gCO2/kWh`;
    } else {
      console.error("carbonIntensity element not found in the DOM!");
    }
  }, 500);
};


/**
 * Determines and displays the best time to use appliances based on energy usage
 * @param {Object} energyData24hr - Energy data for the past 24 hours
 */
function getBestEnergyTime(energyData24hr) {
  // Find the hour with minimum energy usage
  let minUsage = Infinity;
  let bestHour = 0;
  
  for (const [hour, value] of Object.entries(energyData24hr)) {
    if (value < minUsage) {
      minUsage = value;
      bestHour = parseInt(hour);
    }
  }
  
  // Format the best hour for display
  const formattedHour = bestHour % 12 || 12;
  const amPm = bestHour < 12 ? 'AM' : 'PM';
  const bestTimeFormatted = `${formattedHour}:00 ${amPm}`;
  
  // Calculate the price (using a placeholder pricing formula)
  const price = 0.15 + (minUsage * 0.05);
  
  // Update the UI with the best time information
  let bestTimeElement = document.getElementById("best-time");
  if (bestTimeElement) {
    bestTimeElement.innerHTML = `
      Best Time: <strong>${bestTimeFormatted}</strong>  
      <br> (Price: £${price.toFixed(2)}/kWh)
    `;
    bestTimeElement.style.background = "#007BFF";
    bestTimeElement.style.padding = "10px";
    bestTimeElement.style.color = "white";
    bestTimeElement.style.borderRadius = "5px";
  }
}

/**
 * Sets up the energy chart with weekly and monthly data
 * @param {Object} energyData7days - Energy data for the past 7 days
 * @param {number} userID - The user ID for fetching additional data
 */
async function setupEnergyChart(energyData7days, userID) {
  const ctx = document.getElementById('energyChart').getContext('2d');
  
  // Create gradient fill
  let gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(54, 162, 235, 0.6)');
  gradient.addColorStop(1, 'rgba(54, 162, 235, 0.1)');

  
  // Process weekly data
  const weeklyLabels = [];
  const weeklyData = [];
  
  // Sort dates and extract last 7 days
  const sortedDates = Object.keys(energyData7days).sort();
  const lastSevenDays = sortedDates.slice(-7);
  
  lastSevenDays.forEach(date => {
    // Convert date to day of week
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
    weeklyLabels.push(dayOfWeek);
    weeklyData.push(energyData7days[date]);
  });
  
  // Initialize variables for monthly data
  let monthlyLabels = [];
  let monthlyData = [];
  let currentMode = 'weekly';
  
  // Create chart
  const energyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: weeklyLabels,
      datasets: [{
        label: 'Energy Usage (kWh)',
        data: weeklyData,
        backgroundColor: gradient,
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 3,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: 'rgba(54, 162, 235, 1)',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
        pointHoverBorderWidth: 3,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 20,
          bottom: 10
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(200, 200, 200, 0.2)',
            drawBorder: false
          },
          ticks: {
            padding: 10,
            font: {
              size: 12
            }
          }
        },
        x: {
          grid: {
            color: 'rgba(200, 200, 200, 0.2)',
            display: false
          },
          ticks: {
            padding: 10,
            font: {
              size: 12
            }
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            font: {
              size: 13
            },
            boxWidth: 15,
            padding: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 12
          },
          padding: 10,
          cornerRadius: 6,
          callbacks: {
            label: function(context) {
              return `Usage: ${context.raw} kWh`;
            }
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      animations: {
        tension: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    }
  });
  
  // Setup toggle button for switching between weekly and monthly data
  const toggleButton = document.getElementById('toggleButton');
  toggleButton.addEventListener('click', async () => {
    if (currentMode === 'weekly') {
      // Switch to monthly view
      currentMode = 'monthly';
      toggleButton.textContent = 'Switch to Weekly';
      document.getElementById('chartTitle').textContent = 'Monthly Energy Consumption Statistics';
      
      // Fetch monthly data if not already loaded
      if (monthlyLabels.length === 0) {
        const now = new Date();
        const currentYear = now.getFullYear();
        
        // Create date range for the year
        const startDate = `${currentYear}-01-01`;
        const endDate = `${currentYear}-12-31`;
        
        // Fetch monthly data
        const monthlyEnergyData = await pullDailyEnergyRangeUser(userID, startDate, endDate);
        
        // Process monthly data - aggregate by month
        const monthlyAggregate = {};
        for (const [date, value] of Object.entries(monthlyEnergyData)) {
          const month = new Date(date).getMonth();
          monthlyAggregate[month] = (monthlyAggregate[month] || 0) + value;
        }
        
        // Convert to arrays for chart
        for (let i = 0; i < 12; i++) {
          const monthName = new Date(currentYear, i, 1).toLocaleDateString('en-US', { month: 'short' });
          monthlyLabels.push(monthName);
          monthlyData.push(monthlyAggregate[i] || 0);
        }
      }
      
      // Update chart with monthly data
      energyChart.data.labels = monthlyLabels;
      energyChart.data.datasets[0].data = monthlyData;
      
      // Calculate month-over-month change
      const currentMonthIndex = new Date().getMonth();
      const previousMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
      
      // Avoid division by zero
      let percentChange = 0;
      if (monthlyData[previousMonthIndex] > 0) {
        percentChange = ((monthlyData[currentMonthIndex] - monthlyData[previousMonthIndex]) / monthlyData[previousMonthIndex]) * 100;
      }
      
      // Update footer with comparison message
      const footerMessage = percentChange > 0
        ? `This month's energy use is ${Math.abs(percentChange).toFixed(1)}% higher than last month – turn on power saving mode!`
        : `This month's energy use is ${Math.abs(percentChange).toFixed(1)}% lower than last month – great job conserving!`;
      
      document.getElementById('chartFooter').textContent = footerMessage;
      
    } else {
      // Switch back to weekly view
      currentMode = 'weekly';
      toggleButton.textContent = 'Switch to Monthly';
      document.getElementById('chartTitle').textContent = 'Weekly Energy Consumption Statistics';
      
      // Calculate week-over-week change
      const currentWeekSum = weeklyData.slice(-7).reduce((sum, value) => sum + value, 0);
      const previousWeekSum = weeklyData.slice(0, 7).reduce((sum, value) => sum + value, 0);
      
      // Avoid division by zero
      let percentChange = 0;
      if (previousWeekSum > 0) {
        percentChange = ((currentWeekSum - previousWeekSum) / previousWeekSum) * 100;
      }
      
      // Update footer with comparison message
      const footerMessage = percentChange > 0
        ? `This week's energy use is ${Math.abs(percentChange).toFixed(1)}% higher than last week – turn on power saving mode!`
        : `This week's energy use is ${Math.abs(percentChange).toFixed(1)}% lower than last week – great job conserving!`;
      
      document.getElementById('chartFooter').textContent = footerMessage;
      
      // Update chart with weekly data
      energyChart.data.labels = weeklyLabels;
      energyChart.data.datasets[0].data = weeklyData;
    }
    
    // Apply changes to the chart
    energyChart.update();
  });
}
