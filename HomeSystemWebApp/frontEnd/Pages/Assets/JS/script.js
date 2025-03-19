import * as energyAPI from './energyAPI.js';
import * as deviceAPI from './deviceAPI.js';

let user = JSON.parse(localStorage.getItem("user"));
let userID = user ? user.userID : null;
let devices = JSON.parse(localStorage.getItem("devices")) || [];
let selectedDeviceID = "all"; // Default to showing all devices

document.addEventListener("DOMContentLoaded", async function() {
    // Fetch all devices for the user if not already in localStorage
    if (!devices.length && userID) {
        try {
            const response = await deviceAPI.pullDevices(userID);
            if (response.success) {
                devices = response.sentDevices;
                localStorage.setItem("devices", JSON.stringify(devices));
            }
        } catch (error) {
            console.error("Failed to fetch devices:", error);
        }
    }

    // Create and populate the device selector dropdown
    createDeviceSelector();

    // Initialize chart with all devices by default
    await initializeChart(selectedDeviceID);

    // Update other UI elements
    updateEnergyPanel();
    makePanelDraggable();
    checkAutomationsOnDashboard();

    // Check and apply current automations
    checkAndApplyCurrentAutomations();
});

function createDeviceSelector() {
    // Create dropdown container
    const selectorContainer = document.createElement("div");
    selectorContainer.className = "device-selector-container";
    selectorContainer.style.margin = "10px 0";
    
    // Create label
    const label = document.createElement("label");
    label.textContent = "Select Device: ";
    label.setAttribute("for", "deviceSelector");
    
    // Create select element
    const select = document.createElement("select");
    select.id = "deviceSelector";
    select.className = "device-selector";
    select.style.padding = "8px";
    select.style.borderRadius = "4px";
    select.style.marginLeft = "15px";
    
    // Add "All Devices" option
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Devices";
    select.appendChild(allOption);
    
    // Add individual device options
    if (Array.isArray(devices)) {
        devices.forEach(device => {
            const option = document.createElement("option");
            option.value = device.id;
            option.textContent = device.name;
            select.appendChild(option);
        });
    }
    
    // Event listener for device selection
    select.addEventListener("change", async function() {
        selectedDeviceID = this.value;
        await initializeChart(selectedDeviceID);
    });
    
    // Append elements to container
    selectorContainer.appendChild(label);
    selectorContainer.appendChild(select);
    
    // Find the chart container and insert the selector before it
    const chartContainer = document.getElementById("myChart").parentElement;
    chartContainer.parentElement.insertBefore(selectorContainer, chartContainer);
}

async function initializeChart(deviceSelection) {
    const ctx = document.getElementById("myChart").getContext("2d");

    // Get real energy data from the API
    let energyData = {};
    
    try {
        if (deviceSelection === "all" && userID) {
            // If "All Devices" is selected, get aggregate data
            energyData = await energyAPI.syncEnergy24hrUser(userID);
            console.log("User energy data fetched:", energyData);
        } else if (deviceSelection && deviceSelection !== "all") {
            // Fetch data for specific device
            energyData = await energyAPI.syncEnergy24hrDevice(deviceSelection);
            console.log("Device energy data fetched:", energyData);
        } else {
            console.warn("No valid selection or user ID available, using empty energy data");
        }
    } catch (error) {
        console.error("Error fetching energy data:", error);
    }

    // Create array of hours 0-23
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const labels = hours.map(hour => `${hour.toString().padStart(2, '0')}:00`);
    
    // Map the energy data to the correct format based on API response
    const dataValues = hours.map(hour => {
        const hourKey = hour.toString();
        return energyData && energyData[hourKey] !== undefined ? energyData[hourKey] : 0;
    });

    // Get device name for chart title
    let deviceName = "All Devices";
    if (deviceSelection !== "all") {
        const selectedDevice = Array.isArray(devices) ? 
            devices.find(d => d.id.toString() === deviceSelection.toString()) : null;
        deviceName = selectedDevice ? selectedDevice.name : `Device ${deviceSelection}`;
    }

    // Check if chart already exists and destroy it
    if (window.energyChart) {
        window.energyChart.destroy();
    }

    window.energyChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: `${deviceName} Energy Consumption (kWh)`,
                data: dataValues,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderWidth: 2,
                fill: true,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: "category",
                    title: { display: true, text: "Time (Hours)" },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 12
                    }
                },
                y: {
                    title: { display: true, text: "Energy Consumption (kWh)" },
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '24-Hour Energy Usage',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            return `${value.toFixed(2)} kWh`;
                        }
                    }
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: "x",
                        speed: 10,
                        modifierKey: "ctrl",
                        threshold: 5
                    },
                    zoom: {
                        enabled: true,
                        mode: "x",
                        speed: 0.1,
                        limits: {
                            x: { minRange: 1 }
                        },
                        wheel: {
                            enabled: true,
                            speed: 0.05
                        },
                        pinch: {
                            enabled: true
                        }
                    }
                }
            }
        }
    });

    return window.energyChart;
}
// Update Energy Panel Based on Selected Device or User Data
async function updateEnergyPanel() {
    const panel = document.getElementById('energy-panel');
    const message = document.getElementById('energy-message');
    const energyFill = document.getElementById('energy-fill');
    const energyValue = document.getElementById('energy-value');
    const reportButton = document.getElementById('report-button');

    try {
        // Calculate energy status using the modified function
        const energyStatus = await calculateTotalEnergy(userID);
        const totalEnergy = energyStatus.value;
        const status = energyStatus.status;
        
        // Make sure totalEnergy is a number before using toFixed
        const formattedEnergy = typeof totalEnergy === 'number' ? totalEnergy.toFixed(2) : '0.00';
        
        // Map to energy level for display (inverse relationship - lower energy use = higher level)
        let energyLevel;
        if (status === "optimal") {
            energyLevel = 20;
            panel.style.background = "#28a745";
            message.innerText = "Energy level is optimal! Good job! 😊";
            reportButton.classList.add("hidden");
        } else if (status === "warning") {
            energyLevel = 60;
            panel.style.background = "#ffc107";
            message.innerText = `Your energy level is starting to decrease! Total Energy: ${formattedEnergy} kWh ⚠️ Stay aware!`;
            reportButton.classList.add("hidden");
        } else {
            energyLevel = 90;
            panel.style.background = "#dc3545";
            message.innerText = `Oh no! Your Total Energy level is critical! Total Energy: ${formattedEnergy} kWh 🚨 Check report now!`;
            reportButton.classList.remove("hidden");
        }
        
        energyValue.innerText = `Energy Level: ${energyLevel}%`;
        energyFill.style.width = `${energyLevel}%`;
        
        // Add a separate element to always show the total energy usage
        const totalEnergyDisplay = document.getElementById('total-energy-display') || document.createElement('div');
        totalEnergyDisplay.id = 'total-energy-display';
        totalEnergyDisplay.style.marginTop = '10px';
        totalEnergyDisplay.style.fontWeight = 'bold';
        totalEnergyDisplay.innerText = `Total Energy Usage: ${formattedEnergy} kWh`;
        
        // Append the total energy display if it doesn't exist yet
        if (!document.getElementById('total-energy-display')) {
            panel.appendChild(totalEnergyDisplay);
        }
        
    } catch (error) {
        console.error("Error updating energy panel:", error);
    }
}

// Make Energy Panel Draggable - keeping the existing function
function makePanelDraggable() {
  const panel = document.getElementById("energy-panel");
  let offsetX = 0, offsetY = 0, isDragging = false;

  panel.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - panel.offsetLeft;
      offsetY = e.clientY - panel.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      panel.style.left = `${e.clientX - offsetX}px`;
      panel.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => isDragging = false);
}

// Function to calculate total energy usage from 24-hour data
async function calculateTotalEnergy(userID) {
    try {
        // Use the proper API function to get energy data for past 24 hours
        const energyData = await energyAPI.syncEnergy24hrUser(userID);
        
        if (!energyData || Object.keys(energyData).length === 0) {
            console.warn("No energy data received for the past 24 hours");
            return { value: 0, status: "unknown" };
        }
        
        // Sum up all hourly values
        const totalEnergy = Object.values(energyData).reduce(
            (sum, value) => sum + (typeof value === 'number' ? value : 0), 
            0
        );
        
        console.log("Total energy consumption for past 24 hours:", totalEnergy);
        
        // Determine status based on thresholds
        let status;
        if (totalEnergy >= 100) {
            status = "critical";
        } else if (totalEnergy >= 50) {
            status = "warning";
        } else {
            status = "optimal";
        }
        
        // Return both the total energy value and status
        return {
            value: totalEnergy,
            status: status
        };
    } catch (error) {
        console.error("Error calculating total energy:", error);
        return { value: 0, status: "unknown" };
    }
}

// Function to refresh data when needed
async function refreshEnergyData() {
    await initializeChart(selectedDeviceID);
    updateEnergyPanel();
}

// Add this function to your script.js file
function checkAndApplyCurrentAutomations() {
    const automations = JSON.parse(localStorage.getItem("automations")) || [];
    if (automations.length === 0) return;
    
    // Get current time
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    // Get all devices
    let devices = deviceAPI.getDevices();
    let devicesUpdated = false;
    
    // Check each automation
    automations.forEach(automation => {
      if (!automation.start || !automation.end || !automation.deviceId) return;
      
      // Parse automation times
      const [startHour, startMinute] = automation.start.split(':').map(num => parseInt(num));
      const [endHour, endMinute] = automation.end.split(':').map(num => parseInt(num));
      
      // Convert to minutes for easier comparison
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;
      
      // Find the device
      const deviceToUpdate = devices.find(d => d.id === automation.deviceId);
      if (!deviceToUpdate) return;
      
      // Check if current time is within automation period
      const isWithinTimeRange = currentTimeInMinutes >= startTimeInMinutes && 
                               currentTimeInMinutes < endTimeInMinutes;
      
      if (isWithinTimeRange) {
        // Set device status based on automation setting
        const targetStatus = automation.status === 'ON';
        
        // Only update if status needs to change
        if (deviceToUpdate.status !== targetStatus) {
          console.log(`Applying automation for ${deviceToUpdate.name}: setting to ${automation.status}`);
          deviceToUpdate.status = targetStatus;
          devicesUpdated = true;
        }
      }
    });
    
    // If any devices were updated, save changes and sync with backend
    if (devicesUpdated) {
      // Save to localStorage
      deviceAPI.saveDevices(devices);
      
      // Update UI if we're on the dashboard
      if (typeof renderProducts === "function") {
        renderProducts();
      }
      
      // Sync with backend (one by one to avoid race conditions)
      const syncPromises = devices
        .filter(d => devicesUpdated)
        .map(device => deviceAPI.updateDevice(device.id, { status: device.status })
          .catch(error => console.error(`Failed to sync device ${device.id} with backend:`, error)));
      
      Promise.all(syncPromises)
        .then(() => console.log("All automated device changes synced with backend"))
        .catch(error => console.error("Error syncing automated changes:", error));
    }
  }

// Add refresh button functionality if it exists
document.addEventListener("DOMContentLoaded", function() {
    const refreshButton = document.getElementById('refresh-energy-data');
    if (refreshButton) {
        refreshButton.addEventListener('click', refreshEnergyData);
    }
});


document.addEventListener("DOMContentLoaded", function () {
  const panel = document.getElementById("energy-panel");
  const placeholder = document.getElementById("placeholder-panel");

  let offsetX, offsetY, isDragging = false;

  panel.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - panel.getBoundingClientRect().left;
      offsetY = e.clientY - panel.getBoundingClientRect().top;
      panel.style.cursor = "grabbing";

      // Remove transition so dragging is smooth after snapping
      panel.style.transition = "none";
  });

  document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      let x = e.clientX - offsetX;
      let y = e.clientY - offsetY;

      // Keep within screen bounds
      const panelWidth = panel.offsetWidth;
      const panelHeight = panel.offsetHeight;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      if (x < 10) x = 10;
      if (x + panelWidth > screenWidth - 10) x = screenWidth - panelWidth - 10;
      if (y < 100) y = 100;
      if (y + panelHeight > screenHeight - 50) y = screenHeight - panelHeight - 50;

      panel.style.left = `${x}px`;
      panel.style.top = `${y}px`;

      // Detect if the panel is near the placeholder (MAGNET effect)
      const panelRect = panel.getBoundingClientRect();
      const placeholderRect = placeholder.getBoundingClientRect();
      const threshold = 1000; // Distance before snapping

      if (
          Math.abs(panelRect.left - placeholderRect.left) < threshold &&
          Math.abs(panelRect.top - placeholderRect.top) < threshold
      ) {
          placeholder.classList.add("active"); // Highlight placeholder
      } else {
          placeholder.classList.remove("active");
      }
  });

  document.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      panel.style.cursor = "grab";

      // Snap to placeholder if close enough
      const panelRect = panel.getBoundingClientRect();
      const placeholderRect = placeholder.getBoundingClientRect();
      const threshold = 40;

      if (
          Math.abs(panelRect.left - placeholderRect.left) < threshold &&
          Math.abs(panelRect.top - placeholderRect.top) < threshold
      ) {
          panel.style.transition = "top 0.3s ease-in-out, left 0.3s ease-in-out";
          panel.style.left = `${placeholderRect.left}px`;
          panel.style.top = `${placeholderRect.top}px`;
      }

      placeholder.classList.remove("active");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  let user = JSON.parse(localStorage.getItem("user")) || [];
  
  const energyPanel = document.getElementById("energy-panel");
  const energyPanelPin = document.getElementById("placeholder-panel");

  if (!user) {
      console.warn("No user found, hiding energy panel.");
      energyPanel.style.display = "none";
      energyPanelPin.style.display = "none";
      return;
  }

  // Show draggable panel only if the user is a regular "user"
  if (user.userType === "homeUser") {
      energyPanel.style.display = "block"; // Make it visible
      makePanelDraggable();
  } else {
      energyPanel.style.display = "none"; // Hide for homeManager
      energyPanelPin.style.display = "none";
  }
});



// Main dashboard device handling with API calls
document.addEventListener("DOMContentLoaded", async () => {
    // ----- Load user & devices from localStorage -----
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const userID = user.userID;
    const userType = user.userType || "homeUser";
    
    // Fetch devices from backend first, then load from localStorage
    if (userID) {
        try {
            await deviceAPI.syncDevicesFromBackend(userID);
        } catch (error) {
            console.error("Failed to sync devices from backend:", error);
        }
    }
    
    let devices = deviceAPI.getDevices();
  
    // DOM references
    const categoryNav = document.getElementById("categoryNav");
    const productsContainer = document.getElementById("productsContainer");

    // Categories
    const categories = ["all", "Living Room", "Kitchen", "Bedroom"];
    let currentFilter = "all";
  
    // Save devices to localStorage AND update backend
    async function saveDeviceWithSync(device) {
        // First save to localStorage
        deviceAPI.saveDevices(devices);
        
        // Then update backend if device has an ID (existing device)
        if (device && device.id) {
            try {
                await deviceAPI.updateDevice(device.id, device);
                console.log(`Device ${device.id} synced with backend`);
            } catch (error) {
                console.error(`Failed to sync device ${device.id} with backend:`, error);
            }
        }
    }
  
    // Font Awesome icon by type
    function getDeviceIcon(type) {
      switch (type) {
        case "Light":
          return "fa-lightbulb";
        case "Curtain":
          return "fa-window-maximize";
        case "Main Door":
          return "fa-door-open";
        case "Robot":
          return "fa-robot";
        case "Air Conditioning":
          return "fa-snowflake";
        case "EnergyUsage":
          return "fa-electric";
        case "EnergyGeneration":
          return "fa-electric";
        default:
          return "fa-cog";
      }
    }
  
    // Render category nav
    function renderCategoryNav() {
      categoryNav.innerHTML = "";
      categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = "category-button";
        btn.textContent = cat;
        if (cat.toLowerCase() === currentFilter.toLowerCase()) {
          btn.classList.add("active");
        }
        btn.addEventListener("click", () => {
          currentFilter = cat;
          renderCategoryNav();
          renderProducts();
        });
        categoryNav.appendChild(btn);
      });
    }
  
    // Render products with updated backend sync
    async function renderProducts() {
      productsContainer.innerHTML = "";
      
      // Refresh devices from backend before rendering
      if (userID) {
          try {
              await deviceAPI.syncDevicesFromBackend(userID);
              // Update local devices variable after sync
              devices = deviceAPI.getDevices();
          } catch (error) {
              console.error("Failed to refresh devices from backend:", error);
          }
      }
      
      // Filter by room
      let filtered = devices;
      if (currentFilter.toLowerCase() !== "all") {
        filtered = devices.filter(d => d.room.toLowerCase() === currentFilter.toLowerCase());
      }
      if (filtered.length === 0) {
        productsContainer.innerHTML = "<p>No devices added in this section</p>";
        // Still show plus button if user is admin
        renderPlusButton();
        return;
      }
  
      // Build product cards
      filtered.forEach(device => {
        const card = document.createElement("div");
        card.className = "productCard";
  
        // Device icon
        const iconClass = getDeviceIcon(device.type);
        // On/Off switch checked state
        const checkedAttr = device.status ? "checked" : "";
        // AC Temp
        const acTemp = device.acTemp !== undefined ? device.acTemp : 24;
  
        // Build card HTML
        let cardHTML = `
          <div class="product-header">
            <i class="fas ${iconClass} product-icon"></i>
          </div>
          <h3>${device.name}</h3>
          <p>${device.room} - ${device.type}</p>
          <p>Info: ${device.info || "N/A"}</p>
          
          <!-- iOS-style on/off switch -->
          <label class="switch">
            <input type="checkbox" data-id="${device.id}" class="status-switch" ${checkedAttr}>
            <span class="slider"></span>
          </label>
        `;
  
        // If AC, show slider
        if (device.type === "Air Conditioning") {
          cardHTML += `
            <div class="ac-slider-container">
              <input 
                type="range" 
                min="16" 
                max="30" 
                value="${acTemp}" 
                data-id="${device.id}" 
                class="ac-slider" />
              <div class="temp-label" id="tempLabel-${device.id}">${acTemp}°C</div>
            </div>
          `;
        }
  
        // If homeManager, show Edit & Delete
        if (userType === "homeManager") {
          cardHTML += `
            <button class="edit-btn" data-id="${device.id}">Edit</button>
            <button class="delete-btn" data-id="${device.id}">Delete</button>
          `;
        }
  
        card.innerHTML = cardHTML;
        productsContainer.appendChild(card);
      });
      
      // If admin, add the plus button
      renderPlusButton();
    }
  
    // Plus button for admin
    function renderPlusButton() {
      if (userType === "homeManager") {
        const plusBtn = document.createElement("button");
        plusBtn.className = "add-card";
        plusBtn.textContent = "+";
        plusBtn.addEventListener("click", () => {
          window.location.href = "Device-handling.html";
        });
        productsContainer.appendChild(plusBtn);
      }
    }
  
    // Toggle device status with backend sync
    async function toggleStatus(deviceId) {
      const deviceToUpdate = devices.find(d => d.id === deviceId);
      if (!deviceToUpdate) return;
      
      // Toggle the status
      deviceToUpdate.status = !deviceToUpdate.status;
      
      // Update in localStorage
      devices = devices.map(d => d.id === deviceId ? deviceToUpdate : d);
      deviceAPI.saveDevices(devices);
      
      // Update in backend
      try {
          await deviceAPI.updateDevice(deviceId, { status: deviceToUpdate.status });
          console.log(`Device ${deviceId} status updated to ${deviceToUpdate.status} in backend`);
      } catch (error) {
          console.error(`Failed to update device ${deviceId} status in backend:`, error);
          // Revert local change if backend update fails
          deviceToUpdate.status = !deviceToUpdate.status;
          devices = devices.map(d => d.id === deviceId ? deviceToUpdate : d);
          deviceAPI.saveDevices(devices);
          
          alert("Failed to update device status. Please try again.");
      }
      
      renderProducts();
    }
  
    // Update AC temp with backend sync
    async function updateACTemp(deviceId, newTemp) {
      const tempValue = parseInt(newTemp);
      const deviceToUpdate = devices.find(d => d.id === deviceId);
      
      if (!deviceToUpdate || deviceToUpdate.type !== "Air Conditioning") return;
      
      // Update locally
      deviceToUpdate.acTemp = tempValue;
      devices = devices.map(d => d.id === deviceId ? deviceToUpdate : d);
      deviceAPI.saveDevices(devices);
      
      // Update in backend
      try {
          await deviceAPI.updateDevice(deviceId, { acTemp: tempValue });
          console.log(`Device ${deviceId} AC temp updated to ${tempValue} in backend`);
      } catch (error) {
          console.error(`Failed to update device ${deviceId} AC temp in backend:`, error);
      }
      
      // Update UI
      const tempLabel = document.getElementById(`tempLabel-${deviceId}`);
      if (tempLabel) {
        tempLabel.textContent = `${tempValue}°C`;
      }
    }
  
    // Listen for clicks in productsContainer
    productsContainer.addEventListener("click", async (e) => {
      const target = e.target;
      if (!target.hasAttribute("data-id")) return;
      
      const deviceIdAttr = target.getAttribute("data-id");
      const deviceId = parseInt(deviceIdAttr);
  
      // Edit button click
      if (target.classList.contains("edit-btn")) {
        if (userType === "homeManager") {
          await openEditModal(deviceId);
        }
      }
      // Delete button click
      else if (target.classList.contains("delete-btn")) {
        if (userType === "homeManager") {
          await deleteDevice(deviceId);
        }
      }
    });
  
    // Listen for changes on the iOS-style switch and AC slider
    productsContainer.addEventListener("change", async (e) => {
      if (!e.target.hasAttribute("data-id")) return;
      
      const deviceId = parseInt(e.target.getAttribute("data-id"));
      
      // iOS switch change
      if (e.target.classList.contains("status-switch")) {
        await toggleStatus(deviceId);
      }
      // AC slider change
      else if (e.target.classList.contains("ac-slider")) {
        await updateACTemp(deviceId, e.target.value);
      }
    });
  
    // Edit device with backend sync
    async function openEditModal(deviceId) {
      const device = devices.find(d => d.id === deviceId);
      if (!device) return;
      
      const newName = prompt("New device name:", device.name) || device.name;
      const newRoom = prompt("New device room:", device.room) || device.room;
      const newInfo = prompt("New device info:", device.info) || device.info;
      
      // Create updated device object
      const updatedFields = {
        name: newName,
        room: newRoom,
        info: newInfo
      };
      
      // Update locally
      const updatedDevice = { ...device, ...updatedFields };
      devices = devices.map(d => d.id === deviceId ? updatedDevice : d);
      deviceAPI.saveDevices(devices);
      
      // Update in backend
      try {
          await deviceAPI.updateDevice(deviceId, updatedFields);
          console.log(`Device ${deviceId} updated in backend`);
          renderProducts();
      } catch (error) {
          console.error(`Failed to update device ${deviceId} in backend:`, error);
          alert("Failed to update device. Please try again.");
      }
    }
    
    // Delete device with backend sync
    async function deleteDevice(deviceId) {
      if (!confirm("Are you sure you want to delete this device?")) return;
      
      try {
          // Delete from backend first
          await deviceAPI.deleteDeviceBackend(deviceId);
          console.log(`Device ${deviceId} deleted from backend`);
          
          // If backend deletion successful, update local storage
          devices = devices.filter(d => d.id !== deviceId);
          deviceAPI.saveDevices(devices);
          renderProducts();
      } catch (error) {
          console.error(`Failed to delete device ${deviceId} from backend:`, error);
          alert("Failed to delete device. Please try again.");
      }
    }
  
    // Initialize
    renderCategoryNav();
    renderProducts();
});
  
document.addEventListener("DOMContentLoaded", function () {
  // Retrieve user details from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  //If user logs in 
  if (user) {
      
      if (user.userType === "homeUser") {
          // Set the name in the profile section
          document.getElementById("profile-name").textContent = `Welcome back, Home User ${user.firstname}!`;
          document.getElementById("dashboardintro-text").textContent = "To your home page. Enjoy the features we bring to you!";
      } else {
          document.getElementById("profile-name").textContent = `Welcome back, Home Manager ${user.firstname}!`;
          document.getElementById("dashboardintro-text").textContent = "To your home page. Please ensure proper integrity on handling user devices.";
      }
  } else { // If user not logs in, but might be redundant
      document.getElementById("profile-name").textContent = "Welcome, Guest!";
  }
});

// Check automations for dashboard
function checkAutomationsOnDashboard() {
  let automationList = document.getElementById("automation-list");
  let automationText = document.getElementById("automation-text");
  let automationTable = document.getElementById("automation-table");
  let addDeviceAutomationBtn = document.getElementById("add-device-automation");
  let actionColumnHeader = document.querySelector("#automation-table thead tr th:last-child");

  let user = JSON.parse(localStorage.getItem("user")) || null;
  let userRole = user ? user.userType : "user"; // Default to normal user if no role

  function loadAutomations() {
      let automations = JSON.parse(localStorage.getItem("automations")) || [];
      
      // Check if automation elements exist on the page
      if (!automationList || !automationTable) {
          console.warn("Automation elements not found on this page");
          return;
      }

      automationList.innerHTML = "";

      if (automations.length === 0) {
          automationTable.style.display = "none";
          if (addDeviceAutomationBtn) addDeviceAutomationBtn.style.display = "none";
          
          if (automationText) {
              if (userRole === "homeManager") {
                  automationText.innerHTML = `
                      <p class="no-automation">
                          No automation setup. <a href="Automation.html">Go to Device Automation</a>
                      </p>`;
              } else {
                  automationText.innerHTML = `
                      <p class="no-automation">
                          No automation has been set up by the Home Manager! Contact them to configure automations.
                      </p>`;
              }
          }
          return;
      }

      // Automations exist, show the table
      if (automationText) automationText.innerHTML = "";
      automationTable.style.display = "table";
      
      if (addDeviceAutomationBtn) {
          if (userRole === "homeUser") {
              addDeviceAutomationBtn.style.display = "none"; // Hide add button for users
              if (actionColumnHeader) actionColumnHeader.classList.add("hide-action-column"); // Hide action column header
          } else {
              addDeviceAutomationBtn.style.display = "block"; // Show for admins
          }
      }

      // Populate the automation list
      automations.forEach((automation, index) => {
          let row = document.createElement("tr");

          // Format the device information to include name and type
          let deviceInfo = automation.deviceName || "Unknown Device";
          if (automation.deviceType) {
              deviceInfo += ` (${automation.deviceType})`;
          }

          row.innerHTML = `
              <td>${deviceInfo}</td>
              <td>${automation.status || "N/A"}</td>
              <td>${formatTime(automation.start)}</td>
              <td>${formatTime(automation.end)}</td>
              <td><em>Home Manager</em></td>
              ${
                  userRole === "homeManager"
                      ? `<td><button class="delete-automation" data-index="${index}">Delete</button></td>`
                      : ""
              }
          `;

          automationList.appendChild(row);
      });

      // Add event listeners to delete buttons
      document.querySelectorAll(".delete-automation").forEach(button => {
          button.addEventListener("click", function () {
              let index = parseInt(this.getAttribute("data-index"));
              deleteAutomation(index);
          });
      });
  }

  // Format time function for 12-hour format display
  function formatTime(time24) {
      if (!time24) return "N/A";
      
      const [hours, minutes] = time24.split(':');
      const period = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours % 12 || 12;
      return `${hours12}:${minutes} ${period}`;
  }

  // Function to delete an automation
  function deleteAutomation(index) {
      let automations = JSON.parse(localStorage.getItem("automations")) || [];
      if (index < 0 || index >= automations.length) return;
      
      const automationToDelete = automations[index];
      
      // Check if automation is currently active to reset device state
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      if (automationToDelete && automationToDelete.start && automationToDelete.end) {
          // Parse start and end times
          const [startHour, startMinute] = automationToDelete.start.split(':').map(num => parseInt(num));
          const [endHour, endMinute] = automationToDelete.end.split(':').map(num => parseInt(num));
          
          // Calculate time in minutes for easier comparison
          const currentTimeInMinutes = currentHour * 60 + currentMinute;
          const startTimeInMinutes = startHour * 60 + startMinute;
          const endTimeInMinutes = endHour * 60 + endMinute; // Fixed the variable name
          
          // Check if current time is within the automation period
          if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes) {
              // This automation is currently active, so reset the device status
              const devices = deviceAPI.getDevices();
              const deviceToUpdate = devices.find(d => d.id === automationToDelete.deviceId);
              
              if (deviceToUpdate) {
                  // Reset the device to the opposite status of what the automation set
                  deviceToUpdate.status = automationToDelete.status === 'OFF';
                  
                  // Save the updated devices using the deviceAPI
                  deviceAPI.saveDevices(devices);
                  
                  // Update device in backend
                  deviceAPI.updateDevice(deviceToUpdate.id, { status: deviceToUpdate.status })
                      .then(() => {
                          console.log(`Device ${deviceToUpdate.name} status reset after automation deletion and synced with backend`);
                          
                          // If we're on the dashboard, refresh the UI
                          if (typeof renderProducts === "function") {
                              renderProducts();
                          }
                      })
                      .catch(error => {
                          console.error(`Failed to sync device status with backend:`, error);
                          alert("Device status updated locally but failed to sync with backend.");
                      });
              }
          }
      }
      
      // Add a fade-out animation
      const row = automationList.children[index];
      if (row) {
          row.classList.add("fade-out");
          
          // Remove after animation completes
          setTimeout(() => {
              automations.splice(index, 1);
              localStorage.setItem("automations", JSON.stringify(automations));
              
              // Add call to sync automations with backend if there's an API for it
              // This would look like: automationAPI.syncAutomationsToBackend(automations);
              
              loadAutomations();
          }, 500); // Match with CSS animation duration
      } else {
          // If row not found, just remove the automation immediately
          automations.splice(index, 1);
          localStorage.setItem("automations", JSON.stringify(automations));
          loadAutomations();
      }
  }

  // Initialize automations
  loadAutomations();
}


window.addEventListener("deviceStatusChanged", function(event) {
  console.log("Device status changed by automation");
  if (typeof renderProducts === "function") {
      renderProducts();
  }
});


document.addEventListener("DOMContentLoaded", function () {
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent("Check out my smart home automation!");

    // Share to Twitter
    document.getElementById("share-twitter").addEventListener("click", function (e) {
        e.preventDefault();
        const twitterUrl = `https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}`;
        window.open(twitterUrl, "_blank");
    });

    // Share to Facebook
    document.getElementById("share-facebook").addEventListener("click", function (e) {
        e.preventDefault();
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
        window.open(facebookUrl, "_blank");
    });

    // Share to Instagram (Instagram does not allow direct URL sharing)
    document.getElementById("share-instagram").addEventListener("click", function (e) {
        e.preventDefault();
        alert("Instagram does not support direct URL sharing. Share manually on your story!");
    });
});