// Import necessary functions from energyAPI.js
import { 
  syncEnergy7daysUser, 
  pullDailyEnergyRangeUser,
  syncEnergy24hrUser,
  sumDayEnergyUser
} from './energyAPI.js';

document.addEventListener('DOMContentLoaded', async () => {
  
  // ----- Initial Setup -----
  updateTime();
  setInterval(updateTime, 1000);
  
  // Get the current user ID (you might need to adjust this based on your auth system)
  const userID = getUserID(); // Replace with your actual function to get user ID
  
  const ctx = document.getElementById('energyChart').getContext('2d');
  
  // Initialize chart with loading state
  let currentMode = 'weekly';
  let energyChart;
  
  // ----- Real-time Data Fetching -----
  
  // Fetch current energy usage data and update UI
  async function fetchCurrentUsage() {
    try {
      // Get the 24-hour energy data
      const hourlyData = await syncEnergy24hrUser(userID);
      
      // Calculate current power by using the most recent hour's data
      // Real-time power would come from a different API endpoint in a real system
      const hours = Object.keys(hourlyData).sort();
      const latestHour = hours[hours.length - 1];
      const currentPowerKW = (hourlyData[latestHour] / 1000).toFixed(1); // Convert to kW for display
      
      // Calculate 24-hour total
      const daily24hrTotal = Object.values(hourlyData).reduce((sum, val) => sum + val, 0);
      
      // Update UI elements
      document.getElementById('currentPower').textContent = `${currentPowerKW} kW`;
      document.getElementById('dailyUsage').textContent = `${daily24hrTotal.toFixed(1)} kWh`;
      
      // Calculate estimated cost (assuming average rate of £0.28 per kWh)
      const costRate = 0.28;
      const estimatedCost = (daily24hrTotal * costRate).toFixed(2);
      document.getElementById('estimatedCost').textContent = `£${estimatedCost}`;
    } catch (error) {
      console.error('Error fetching current usage data:', error);
      document.getElementById('currentPower').textContent = 'Error loading';
      document.getElementById('dailyUsage').textContent = 'Error loading';
      document.getElementById('estimatedCost').textContent = 'Error loading';
    }
  }
  
  // Fetch weekly data (last 7 days)
  async function fetchWeeklyData() {
    try {
      document.getElementById('chartTitle').textContent = 'Loading weekly data...';
      
      // Get the last 7 days of energy data
      const weeklyData = await syncEnergy7daysUser(userID);
      

      // Process the data for chart display
      const dates = Object.keys(weeklyData).sort();
      const weeklyLabels = dates.map(date => {
        const d = new Date(date);
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
      });
      const weeklyValues = dates.map(date => weeklyData[date]);
      
      // Calculate week-over-week change
      const currentWeekTotal = weeklyValues.reduce((sum, val) => sum + val, 0);
      
      // Get previous week data for comparison
      const today = new Date();
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const twoWeeksAgo = new Date(today);
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      
      const prevWeekStart = twoWeeksAgo.toISOString().split('T')[0];
      const prevWeekEnd = oneWeekAgo.toISOString().split('T')[0];
      
      const previousWeekData = await pullDailyEnergyRangeUser(userID, prevWeekStart, prevWeekEnd);
      const previousWeekTotal = Object.values(previousWeekData).reduce((sum, val) => sum + val, 0);
      
      // Calculate percentage change
      const percentChange = previousWeekTotal === 0 ? 100 : 
        ((currentWeekTotal - previousWeekTotal) / previousWeekTotal * 100).toFixed(1);
      
      // Update chart title and footer
      document.getElementById('chartTitle').textContent = 'Weekly Energy Consumption Statistics';
      document.getElementById('chartFooter').textContent = 
        `This week's energy use is ${Math.abs(percentChange)}% ${percentChange > 0 ? 'higher' : 'lower'} than last week – ${percentChange > 0 ? 'try to conserve more!' : 'great job saving energy!'}`;
      
      return {
        labels: weeklyLabels, 
        data: weeklyValues,
        maxValue: Math.max(...weeklyValues) * 1.2 // Add 20% headroom
      };
    } catch (error) {
      console.error('Error fetching weekly data:', error);
      document.getElementById('chartTitle').textContent = 'Weekly Energy Consumption Statistics';
      document.getElementById('chartFooter').textContent = 'Failed to load data. Please try again later.';
      // Return dummy data if API call fails
      return {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        data: [0, 0, 0, 0, 0, 0, 0],
        maxValue: 100
      };
    }
  }
  
  
  // Fetch monthly data
  async function fetchMonthlyData() {
    try {
      document.getElementById('chartTitle').textContent = 'Loading monthly data...';
      
      // Get current date and calculate start of year
      const today = new Date();
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const startDate = startOfYear.toISOString().split('T')[0];
      const endDate = today.toISOString().split('T')[0];
      
      // Get daily data for the entire year so far
      const yearData = await pullDailyEnergyRangeUser(userID, startDate, endDate);
      
      // Aggregate by month
      const monthlyData = {};
      for (let i = 0; i < 12; i++) {
        monthlyData[i] = 0;
      }
      
      // Process data
      Object.keys(yearData).forEach(date => {
        const month = new Date(date).getMonth();
        monthlyData[month] += yearData[date];
      });
      
      // Prepare labels and data for chart
      const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyValues = Object.values(monthlyData);
      
      // Calculate month-over-month change
      const currentMonth = today.getMonth();
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      
      const currentMonthTotal = monthlyData[currentMonth];
      const previousMonthTotal = monthlyData[previousMonth];
      
      // Calculate percentage change
      const percentChange = previousMonthTotal === 0 ? 100 : 
        ((currentMonthTotal - previousMonthTotal) / previousMonthTotal * 100).toFixed(1);
      
      // Update chart title and footer
      document.getElementById('chartTitle').textContent = 'Monthly Energy Consumption Statistics';
      document.getElementById('chartFooter').textContent = 
        `This month's energy use is ${Math.abs(percentChange)}% ${percentChange > 0 ? 'higher' : 'lower'} than last month – ${percentChange > 0 ? 'consider energy saving options!' : 'excellent conservation!'}`;
      
      return {
        labels: monthlyLabels,
        data: monthlyValues,
        maxValue: Math.max(...monthlyValues) * 1.2 // Add 20% headroom
      };
    } catch (error) {
      console.error('Error fetching monthly data:', error);
      document.getElementById('chartTitle').textContent = 'Monthly Energy Consumption Statistics';
      document.getElementById('chartFooter').textContent = 'Failed to load data. Please try again later.';
      // Return dummy data if API call fails
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        maxValue: 100
      };
    }
  }
  
  // ----- Chart Initialization and Update -----
  
  // Initial chart creation
  async function initializeChart() {
    const weeklyChartData = await fetchWeeklyData();
    
    energyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: weeklyChartData.labels,
        datasets: [{
          label: 'Energy Usage',
          data: weeklyChartData.data,
          backgroundColor: 'rgba(100,100,100,0.1)',
          borderColor: 'rgba(100,100,100,0.7)',
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointBackgroundColor: '#fff',
          pointBorderColor: 'rgba(100,100,100,0.7)',
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        animation: {
          duration: 600,
          easing: 'easeInOutQuad'
        },
        scales: {
          y: {
            beginAtZero: true,
            max: weeklyChartData.maxValue,
            ticks: { color: '#555' },
            grid: { color: 'rgba(220,220,220,0.3)', drawBorder: false }
          },
          x: {
            ticks: { color: '#555' },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleColor: '#fff',
            bodyColor: '#fff',
            displayColors: false,
            callbacks: {
              label: function(context) {
                return context.parsed.y.toFixed(1) + ' kWh';
              }
            }
          }
        }
      }
    });
  }
  
  // Update chart when toggling between weekly and monthly
  async function updateChart() {
    let chartData;
    
    if (currentMode === 'weekly') {
      chartData = await fetchWeeklyData();
    } else {
      chartData = await fetchMonthlyData();
    }
    
    energyChart.data.labels = chartData.labels;
    energyChart.data.datasets[0].data = chartData.data;
    energyChart.options.scales.y.max = chartData.maxValue;
    energyChart.update();
  }
  
  // ----- Toggle Button Setup -----
  
  const toggleButton = document.getElementById('toggleButton');
  toggleButton.addEventListener('click', async () => {
    toggleButton.disabled = true;
    toggleButton.textContent = 'Loading...';
    
    if (currentMode === 'weekly') {
      currentMode = 'monthly';
      toggleButton.textContent = 'Switch to Weekly';
    } else {
      currentMode = 'weekly';
      toggleButton.textContent = 'Switch to Monthly';
    }
    
    await updateChart();
    toggleButton.disabled = false;
  });
  
  // ----- Best Time Recommendation -----
  
  // Fetch real energy pricing data from an API
  async function getBestEnergyTime() {
    try {
      // In a real implementation, you would have an API endpoint to fetch energy pricing data
      // For this example, we'll simulate an API call and add randomness to make it dynamic
      
      // Simulated API response - in a real app, replace with actual API call
      const now = new Date();
      const hours = [0, 6, 12, 18, 22]; // Hours to check for rates
      
      // Generate slightly random prices (would come from your actual API)
      const energyRates = hours.map(hour => {
        // Base prices with some randomization to simulate real data
        let basePrice;
        if (hour >= 0 && hour < 6) basePrice = 0.25; // Overnight
        else if (hour >= 6 && hour < 12) basePrice = 0.30; // Morning
        else if (hour >= 12 && hour < 18) basePrice = 0.45; // Afternoon
        else if (hour >= 18 && hour < 22) basePrice = 0.55; // Evening peak
        else basePrice = 0.20; // Late night
        
        // Add some randomness (±10%)
        const randomFactor = 0.9 + Math.random() * 0.2;
        const price = basePrice * randomFactor;
        
        // Format time
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
        
        return { time: timeStr, price: price };
      });
      
      // Find the cheapest energy time
      energyRates.sort((a, b) => a.price - b.price);
      const bestTime = energyRates[0]; // Get lowest price time
      
      // Create or update the best time element
      let bestTimeElement = document.getElementById("best-time");
      if (!bestTimeElement) {
        bestTimeElement = document.createElement("div");
        bestTimeElement.id = "best-time";
        document.getElementById("energyContainer").appendChild(bestTimeElement);
      }
      
      bestTimeElement.innerHTML = `
        Best Time to Use Energy: <strong>${bestTime.time}</strong>  
        <br> (Price: £${bestTime.price.toFixed(2)}/kWh)
      `;
      bestTimeElement.style.background = "#007BFF";
      bestTimeElement.style.padding = "10px";
      bestTimeElement.style.color = "white";
      bestTimeElement.style.borderRadius = "5px";
      bestTimeElement.style.marginTop = "20px";
      bestTimeElement.style.textAlign = "center";
      bestTimeElement.style.fontWeight = "bold";
      
      // Set up auto-refresh for energy rates (every 30 minutes)
      setTimeout(getBestEnergyTime, 30 * 60 * 1000);
      
    } catch (error) {
      console.error("Error fetching energy rates:", error);
      const bestTimeElement = document.getElementById("best-time");
      if (bestTimeElement) {
        bestTimeElement.textContent = "Unable to fetch best energy time. Please try again later.";
      }
    }
  }
  
  // ----- Utility Functions -----
  
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
  
  function getUserID() {
    // Replace with your actual implementation to get the logged-in user's ID
    // Could be from localStorage, session, or a global variable
    const user = JSON.parse(localStorage.getItem("user"));
    const userID = user ? user.userID : null;
    return userID;
  }
  
  // ----- Initialization -----
  
  // Fetch current energy usage data
  await fetchCurrentUsage();
  
  // Set up refresh interval for real-time data (every 5 minutes)
  setInterval(fetchCurrentUsage, 5 * 60 * 1000);
  
  // Initialize the chart with data
  await initializeChart();
  
  // Set up the best time recommendation
  await getBestEnergyTime();
  
  // Handle window resize events
  window.addEventListener('resize', function() {
    if (energyChart) {
      energyChart.resize();
    }
  });
});