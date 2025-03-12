//  Overview.js - Optimized & Fully Functional
document.addEventListener('DOMContentLoaded', function() {
    
  //  Initialize Graphs
  initializeEnergyUsageChart();
  initializeEnergyGenerationChart();

  //  Load User Devices
  loadDeviceStatus();

  //  Load Alerts & Notifications (updates every 10 sec)
  loadAlertsAndNotifications();
  setInterval(loadAlertsAndNotifications, 10000);

  // Remove "Device Handling" for Non-Admin Users
  hideDeviceHandlingButton();
});

//Get Current User's Devices
function getCurrentUserDevices() {
  let users = JSON.parse(localStorage.getItem("user")) || [];
  //let lastLoggedInEmail = localStorage.getItem("lastLoggedInEmail") || null;
  //let currentUser = users.find(user => user.email === lastLoggedInEmail);

  if (!users) return [];

  let allDevices = JSON.parse(localStorage.getItem("smartDevices")) || {};
  return allDevices[users.Email] || [];
}

//Save User Devices
function saveUserDevices(devices) {
  //let lastLoggedInEmail = localStorage.getItem("lastLoggedInEmail");
  let allDevices = JSON.parse(localStorage.getItem("smartDevices")) || {};
  allDevices[users.Email] = devices;
  localStorage.setItem("smartDevices", JSON.stringify(allDevices));
}

//Initialize Energy Usage Chart 
function initializeEnergyUsageChart() {
  const ctxUsage = document.getElementById('energyUsageChart').getContext('2d');
  
  new Chart(ctxUsage, {
      type: 'line',
      data: {
          labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          datasets: [{
              label: 'Energy Usage (kWh)',
              data: [20, 25, 22, 30, 28, 26, 24],
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderWidth: 2,
              fill: true
          }]
      },
      options: {
          responsive: true,
          scales: {
              y: { beginAtZero: true }
          },
          plugins: {
              zoom: {
                  pan: { enabled: true, mode: 'x', speed: 10 },
                  zoom: {
                      enabled: true,
                      mode: 'x',
                      speed: 0.1,
                      limits: { x: { minRange: 1 } }, 
                      wheel: { enabled: true, speed: 0.05 },
                      pinch: { enabled: true }
                  }
              },
              tooltip: {
                  callbacks: {
                      label: function(context) {
                          return `Usage: ${context.raw} kWh`;
                      }
                  }
              }
          }
      }
  });
}


//Initialize Energy Generation Chart 
function initializeEnergyGenerationChart() {
  const ctxGen = document.getElementById('energyGenerationChart').getContext('2d');
  
  new Chart(ctxGen, {
      type: 'bar',
      data: {
          labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          datasets: [{
              label: 'Energy Generation (kWh)',
              data: [5, 7, 6, 8, 7, 9, 6],
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 2
          }]
      },
      options: {
          responsive: true,
          scales: {
              y: { beginAtZero: true }
          }
      }
  });
}

//Load & Display Device Status 
function loadDeviceStatus() {
  const deviceContainer = document.getElementById("deviceStatusContainer");
  deviceContainer.innerHTML = "";

  let devices = getCurrentUserDevices();
  
  devices.forEach(device => {
      let deviceCard = document.createElement("div");
      deviceCard.classList.add("device-card");
      
      deviceCard.innerHTML = `
          <h3>${device.name}</h3>
          <p>Status: <span class="device-status">${device.status ? "On" : "Off"}</span></p>
          <p>Room: ${device.category}</p>
          <p>Energy Consumption: ${device.consumption || "N/A"} kWh</p>
          <label class="switch">
              <input type="checkbox" class="toggle" data-id="${device.id}" ${device.status ? "checked" : ""}>
              <span class="slider round"></span>
          </label>
      `;
      
      deviceContainer.appendChild(deviceCard);
  });

  // Add event listener for toggle switches
  document.querySelectorAll(".toggle").forEach(toggle => {
      toggle.addEventListener("change", function() {
          let devices = getCurrentUserDevices();
          let device = devices.find(d => d.id == this.dataset.id);
          if (device) {
              device.status = this.checked;
              saveUserDevices(devices);
              loadDeviceStatus(); // Refresh UI
          }
      });
  });
}

//Load Alerts & Notifications
function loadAlertsAndNotifications() {
  let alertsList = document.getElementById("alertsList");
  let alertsCount = document.getElementById("alertsCount");
  let notificationsList = document.getElementById("notificationsList");
  let notificationCount = document.getElementById("notificationCount");

  //  Fetch stored alerts and notifications
  let alerts = JSON.parse(localStorage.getItem("criticalReports")) || [];
  let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

  //  Ensure data is formatted correctly
  alertsList.innerHTML = alerts.length > 0 ? "" : "<li>(No Alerts)</li>";

  notificationsList.innerHTML = notifications.length > 0  ? "" : "<li>(Empty!)</li>";

  //  Update alert & notification count in UI
  alertsCount.innerText = `(${alerts.length})`;
  notificationCount.innerText = `(${notifications.length})`;
}

//Run on page load & auto-refresh every 10 sec
document.addEventListener("DOMContentLoaded", loadAlertsAndNotifications);
setInterval(loadAlertsAndNotifications, 10000);


// Hide "Device Handling" for Non-Admins 
function hideDeviceHandlingButton() {
    let user = JSON.parse(localStorage.getItem("user"));

  let devideHandlingButton = document.getElementById("device-handling-btn");

  if (user.userType === "homeManager") {
    devideHandlingButton.style.display = "block";
  } else {
    devideHandlingButton.style.display = "none";
  }
}
