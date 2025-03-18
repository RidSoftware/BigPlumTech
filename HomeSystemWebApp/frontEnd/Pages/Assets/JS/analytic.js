// Import necessary functions from energyAPI.js
import { 
  syncEnergy7daysUser, 
  pullDailyEnergyRangeUser,
  syncEnergy24hrUser
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
  
  // ----- Data Fetching Functions -----
  
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
  
  function getBestEnergyTime() {
    // API endpoint can be created to fetch this data
    // For now using sample data that would come from your backend
    const energyRates = [
      { time: "00:00", price: 0.30 },
      { time: "06:00", price: 0.25 },
      { time: "12:00", price: 0.40 },
      { time: "18:00", price: 0.60 },
      { time: "22:00", price: 0.20 }
    ];
    
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
  
  // Initialize the chart with data
  await initializeChart();
  
  // Set up the best time recommendation
  getBestEnergyTime();
  
  // Handle window resize events
  window.addEventListener('resize', function() {
    if (energyChart) {
      energyChart.resize();
    }
  });
});