document.addEventListener('DOMContentLoaded', () => {
  updateTime();
  setInterval(updateTime, 1000);

  const ctx = document.getElementById('energyChart').getContext('2d');

  // Create gradient fill
  let gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(54, 162, 235, 0.6)');
  gradient.addColorStop(1, 'rgba(54, 162, 235, 0.1)');

  // Weekly data setup
  const weeklyLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyData = [50, 35, 25, 40, 55, 45, 30];

  // Monthly data setup
  const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = [30, 60, 65, 80, 70, 50, 40, 45, 55, 60, 70, 80];

  let currentMode = 'weekly';

  const energyChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: weeklyLabels,
          datasets: [{
              label: 'Energy Usage (kWh)',
              data: weeklyData,
              backgroundColor: gradient, // Smooth gradient fill
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

  // Toggle between weekly and monthly data
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
      } else {
          currentMode = 'weekly';
          toggleButton.textContent = 'Switch to Monthly';
          document.getElementById('chartTitle').textContent = 'Weekly Energy Consumption Statistics';
          document.getElementById('chartFooter').textContent =
              "This week’s energy use is 5% higher than last week – turn on power saving mode!";
          energyChart.data.labels = weeklyLabels;
          energyChart.data.datasets[0].data = weeklyData;
      }
      energyChart.update();
  });

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

  function getBestEnergyTime() {
      const energyRates = [
          { time: "00:00", price: 0.30 },
          { time: "06:00", price: 0.25 },
          { time: "12:00", price: 0.40 },
          { time: "18:00", price: 0.60 },
          { time: "22:00", price: 0.20 }
      ];

      energyRates.sort((a, b) => a.price - b.price);
      const bestTime = energyRates[0];

      let bestTimeElement = document.getElementById("best-time");
      if (bestTimeElement) {
          bestTimeElement.innerHTML = `
              Best Time: <strong>${bestTime.time}</strong>  
              <br> (Price: £${bestTime.price.toFixed(2)}/kWh)
          `;
          bestTimeElement.style.background = "#007BFF";
          bestTimeElement.style.padding = "10px";
          bestTimeElement.style.color = "white";
          bestTimeElement.style.borderRadius = "5px";
      } else {
          console.error("Element #best-time not found!");
      }
  }

  document.addEventListener("DOMContentLoaded", getBestEnergyTime);
});
