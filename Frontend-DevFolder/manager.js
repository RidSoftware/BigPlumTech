document.addEventListener('DOMContentLoaded', () => {
    // Update current time in the energy card
    updateTime();
    setInterval(updateTime, 1000);
  
    // ===== Initialize Chart.js for Energy Consumption Chart =====
    const ctx = document.getElementById('energyChart').getContext('2d');
  
    // Weekly data setup
    const weeklyLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData = [50, 35, 25, 40, 55, 45, 30];
  
    // Monthly data setup
    const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const monthlyData = [30, 60, 65, 80, 70, 50, 40];
  
    let currentMode = 'weekly';
  
    const energyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: weeklyLabels,
        datasets: [{
          label: 'Energy Usage',
          data: weeklyData,
          backgroundColor: 'rgba(100,100,100,0.1)',
          borderColor: 'rgba(100,100,100,0.7)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#fff',
          pointBorderColor: 'rgba(100,100,100,0.7)',
        }]
      },
      options: {
        responsive: false, // Disable responsiveness to keep fixed size
        maintainAspectRatio: false,
        animation: {
          duration: 600,
          easing: 'easeInOutQuad'
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 60,
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
                return context.parsed.y + ' kWh';
              }
            }
          }
        }
      }
    });
  
    // Toggle Button Logic to Switch between Weekly and Monthly Data
    const toggleButton = document.getElementById('toggleButton');
    toggleButton.addEventListener('click', () => {
      if (currentMode === 'weekly') {
        currentMode = 'monthly';
        toggleButton.textContent = 'Switch to Weekly';
        document.getElementById('chartTitle').textContent = 'Monthly Energy Consumption Statistics';
        document.getElementById('chartFooter').textContent =
          "This month’s energy use is 5% lower than last month – great job conserving!";
        energyChart.data.labels = monthlyLabels;
        energyChart.data.datasets[0].data = monthlyData;
        energyChart.options.scales.y.max = 100;
      } else {
        currentMode = 'weekly';
        toggleButton.textContent = 'Switch to Monthly';
        document.getElementById('chartTitle').textContent = 'Weekly Energy Consumption Statistics';
        document.getElementById('chartFooter').textContent =
          "This week’s energy use is 5% higher than last week – turn on power saving mode!";
        energyChart.data.labels = weeklyLabels;
        energyChart.data.datasets[0].data = weeklyData;
        energyChart.options.scales.y.max = 60;
      }
      energyChart.update();
    });
  });
  
  /**
   * Updates the current time in the energy card header.
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
  