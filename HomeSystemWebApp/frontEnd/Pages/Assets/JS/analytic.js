document.addEventListener('DOMContentLoaded', () => {
    // ----- Energy Usage and Chart Code -----
    updateTime();
    setInterval(updateTime, 1000);
  
    const ctx = document.getElementById('energyChart').getContext('2d');
    
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
          label: 'Energy Usage',
          data: weeklyData,
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
            max: 100,
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
        energyChart.options.scales.y.max = 100;
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
  
    // ----- Device Management Code -----
    let devices = [
      { id: 1, name: 'Light', room: 'Living Room', status: true,},
      { id: 2, name: 'Robot', room: 'Bedroom', status: false},
    ];
  
    const deviceListEl = document.querySelector('.device-list');
    const roomFilterEl = document.getElementById('roomFilter');
    
    // Fetch userType from localStorage
    const user = JSON.parse(localStorage.getItem("user")) || {}; 
    const userType = user.userType || "homeUser"; // Default to homeUser if undefined

    // Get the product controller text element
    const productControllerText = document.getElementById("product-controller-text");

    // Update the product controller text based on user type
    if (userType === "homeUser") {
        productControllerText.innerHTML = "You can monitor your smart devices here, but changes are restricted. Contact your Home Manager for modifications.";
    } else if (userType === "homeManager") {
        productControllerText.innerHTML = "As a Home Manager, you have full control over all smart devices. Feel free to modify settings.";
    }

    // Render Devices List with Correct Button Visibility
    renderDevices(userType);

    function renderDevices(userType) {
      deviceListEl.innerHTML = ''; 
      const filterValue = roomFilterEl.value;
      let filteredDevices = devices;
  
      if (filterValue !== 'all') {
          filteredDevices = devices.filter(device => device.room.toLowerCase() === filterValue.toLowerCase());
      }
  
      filteredDevices.forEach(device => {
          const deviceItem = document.createElement('div');
          deviceItem.className = 'device-item';
  
          // Start device item layout
          let deviceHTML = `
              <div class="device-info">
                  <h3 class="device-name">${device.name}</h3>
                  <p><strong>Room:</strong> ${device.room}</p>
                  <p><strong>Info:</strong> ${device.info || "No additional info"}</p>
                  <p><strong>Status:</strong> ${device.status ? 'Online' : 'Offline'}</p>
              </div>
              <div class="device-actions">
                  <button class="toggle-btn" data-id="${device.id}">
                      ${device.status ? 'Turn Off' : 'Turn On'}
                  </button>`;
  
          // **Only add Edit & Delete buttons for Home Manager**
          if (userType === "homeManager") {
              deviceHTML += `
                  <button class="edit-btn" data-id="${device.id}">Edit</button>
                  <button class="delete-btn" data-id="${device.id}">Delete</button>
              `;
          }
  
          deviceHTML += `</div>`; // Close the device-actions div
          deviceItem.innerHTML = deviceHTML;
  
          deviceListEl.appendChild(deviceItem);
      });
  
  }
  
  
    roomFilterEl.addEventListener('change', renderDevices);

    deviceListEl.addEventListener("click", (e) => {
      const target = e.target;
      const deviceId = target.getAttribute('data-id');
      if (!deviceId) return;
  
      const id = parseInt(deviceId);
  
      if (target.classList.contains('toggle-btn')) {
          devices = devices.map(device => {
              if (device.id === id) {
                  return { ...device, status: !device.status };
              }
              return device;
          });
          renderDevices(user.userType); // Re-render with correct permissions
      } 
      else if (target.classList.contains('edit-btn')) {
          if (user.userType === "homeManager") {
              const device = devices.find(d => d.id === id);
              if (device) {
                  const newName = prompt("Enter new device name:", device.name) || device.name;
                  const newRoom = prompt("Enter new room:", device.room) || device.room;
                  const newInfo = prompt("Enter new device info:", device.info) || device.info;
                  
                  devices = devices.map(d => {
                      if (d.id === id) {
                          return { ...d, name: newName, room: newRoom, info: newInfo };
                      }
                      return d;
                  });
  
                  renderDevices(user.userType);
              }
          }
      } 
      else if (target.classList.contains('delete-btn')) {
          if (user.userType === "homeManager") {
              if (confirm("Are you sure you want to delete this device?")) {
                  devices = devices.filter(device => device.id !== id);
                  renderDevices(user.userType);
              }
          }
      }
  });
  
    renderDevices();
  });

  window.addEventListener('resize', () => {
    function getBestEnergyTime() {
    // Simulated energy pricing data (Replace this with real API if needed)
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

    // Ensure the element exists before updating
    let bestTimeElement = document.getElementById("best-time");
    if (bestTimeElement) {
        bestTimeElement.innerHTML = `
            Best Time: <strong>${bestTime.time}</strong>  
            <br> (Price: £${bestTime.price.toFixed(2)}/kWh)
        `;
        bestTimeElement.style.background = "#007BFF"; // just to style it 
        bestTimeElement.style.padding = "10px";
        bestTimeElement.style.color = "white";
        bestTimeElement.style.borderRadius = "5px";
    } else {
        console.error("Element #best-time not found!");
    }
    }
    
    // Load recommendation on page load
    document.addEventListener("DOMContentLoaded", getBestEnergyTime);
  });

