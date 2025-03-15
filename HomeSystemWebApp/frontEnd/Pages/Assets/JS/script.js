import { syncDevicesFromBackend, updateDevice } from './deviceAPI.js';

let user = JSON.parse(localStorage.getItem("user"));
let userID = user.userID;

document.addEventListener("DOMContentLoaded", function () {
    syncDevicesFromBackend(userID);
    initializeChart();
    updateEnergyPanel();
    makePanelDraggable();
    checkAutomationsOnDashboard();
});

// Implement the automation check function directly in script.js
function checkAutomationsOnDashboard() {
  const automations = JSON.parse(localStorage.getItem("automations")) || [];
  if (automations.length === 0) return;
  
  const devices = JSON.parse(localStorage.getItem("devices")) || [];
  const now = new Date();
  
  // Format time for comparison
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  let devicesUpdated = false;
  
  automations.forEach(automation => {
      if (!automation.active) return;
      
      // Parse start and end times to hours and minutes
      const [startHour, startMinute] = automation.start.split(':').map(num => parseInt(num));
      const [endHour, endMinute] = automation.end.split(':').map(num => parseInt(num));
      
      // Calculate time in minutes for easier comparison
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;
      
      const device = devices.find(d => d.id === automation.deviceId);
      if (!device) return; // Device not found
      
      // Check if current time is within automation period (between start and end)
      if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes) {
          // Set device status based on automation setting
          device.status = automation.status === 'ON';
          devicesUpdated = true;
          
          console.log(`Automation applied on dashboard load: ${device.name} set to ${automation.status}`);
      } 
      // Check if current time is after end time 
      else if (currentTimeInMinutes >= endTimeInMinutes) {
          // Set device to the opposite status of what it was set to at start time
          device.status = automation.status === 'OFF'; // If automation turns ON, we now turn OFF
          devicesUpdated = true;
          
          console.log(`Automation end time reached: ${device.name} set to ${automation.status === 'ON' ? 'OFF' : 'ON'}`);
      }
  });
  
  // Save updated devices if any changes were made
  if (devicesUpdated) {
      localStorage.setItem("devices", JSON.stringify(devices));
      console.log("Devices updated due to automation rules on dashboard load");
      
      // Refresh the UI since we're on the dashboard
      if (typeof renderProducts === "function") {
          renderProducts();
      }
  }
}

function initializeChart() {
  const ctx = document.getElementById("myChart").getContext("2d");

  // Simulated test data (hourly consumption in kWh)
  const testLabels = [
      "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", 
      "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", 
      "20:00", "21:00", "22:00", "23:00"
  ];
  
  const testData = [
      10, 12, 8, 6, 15, 25, 35, 45, 30, 20, 
      55, 60, 40, 35, 50, 45, 65, 70, 80, 85, 
      90, 95, 85, 70
  ];

  let myChart = new Chart(ctx, {
      type: "line",
      data: {
          labels: testLabels, // Use test labels (hourly intervals)
          datasets: [{
              label: "Energy Consumption (kWh)",
              data: testData, // Use test data values
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
                      maxTicksLimit: 20 // Ensure proper interval spacing
                  }
              },
              y: {
                  title: { display: true, text: "Energy Consumption (kWh)" },
                  beginAtZero: true
              }
          },
          plugins: {
              zoom: {
                  pan: {
                      enabled: true,
                      mode: "x",
                      speed: 10, // Increase smoothness of panning
                      modifierKey: "ctrl", // Pan only when "Ctrl" is held
                      threshold: 5
                  },
                  zoom: {
                      enabled: true,
                      mode: "x",
                      speed: 0.1, // Adjust zoom sensitivity
                      limits: {
                          x: { minRange: 1 } // Prevent over-zooming
                      },
                      wheel: {
                          enabled: true,
                          speed: 0.05 // Reduce zoom speed for better control
                      },
                      pinch: {
                          enabled: true
                      }
                  }
              }
          }
      }
  });

  // Function to reset zoom (optional)
  document.getElementById("resetZoom").addEventListener("click", function () {
      myChart.resetZoom();
  });
}

// Update Energy Panel Based on Energy Level
function updateEnergyPanel() {
    const panel = document.getElementById('energy-panel');
    const message = document.getElementById('energy-message');
    const energyFill = document.getElementById('energy-fill');
    const energyValue = document.getElementById('energy-value');
    const reportButton = document.getElementById('report-button');

    let energyLevel = Math.floor(Math.random() * 100); // Simulated energy level

    energyValue.innerText = `Energy Level: ${energyLevel}%`;
    energyFill.style.width = `${energyLevel}%`;

    if (energyLevel > 70) {
        panel.style.background = "#28a745"; 
        message.innerText = "Energy level is optimal! Good job! 😊";
        reportButton.classList.add("hidden");
    } else if (energyLevel > 40) {
        panel.style.background = "#ffc107"; 
        message.innerText = "Your energy level is starting to decrease! ⚠️ Stay aware!";
        reportButton.classList.add("hidden");
    } else {
        panel.style.background = "#dc3545"; 
        message.innerText = "Oh no! Energy level is critical! 🚨 Check report now!";
        reportButton.classList.remove("hidden");
    }
}

// Make Energy Panel Draggable
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
  //let lastLoggedInEmail = localStorage.getItem("lastLoggedInEmail") || null;
  //let currentUser = users.find(user => user.email === lastLoggedInEmail);
  
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
      enableDrag(energyPanel); // Ensure it's draggable
  } else {
      energyPanel.style.display = "none"; // Hide for homeManager
      energyPanelPin.style.display = "none";
  }
});


    document.addEventListener("DOMContentLoaded", () => {
        // ----- Load user & devices from localStorage -----
        const user = JSON.parse(localStorage.getItem("user")) || {};
        const userType = user.userType || "homeUser";
        let devices = JSON.parse(localStorage.getItem("devices")) || [];
      
        // DOM references
        const profileNameEl = document.getElementById("profile-name");
        const dashboardIntroEl = document.getElementById("dashboardintro-text");
        const categoryNav = document.getElementById("categoryNav");
        const productsContainer = document.getElementById("productsContainer");
      
        // Optionally set user name & intro text
        profileNameEl.textContent = user.name || "Welcome";
        if (userType === "homeManager") {
          dashboardIntroEl.textContent = "As a Home Manager, you have full control over your smart devices.";
        } else {
          dashboardIntroEl.textContent = "You can view your smart devices here. Contact a Home Manager for changes.";
        }
      
        // Categories
        const categories = ["all", "Living Room", "Kitchen", "Bedroom"];
        let currentFilter = "all";
      
        // Save devices to localStorage
        function saveDevices() {
          localStorage.setItem("devices", JSON.stringify(devices));
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
      
        // Render products
        function renderProducts() {
          productsContainer.innerHTML = "";
          
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
      
        // Toggle device status
        function toggleStatus(deviceId) {
          devices = devices.map(d => {
            if (d.id === deviceId) {
              return { ...d, status: !d.status };
            }
            return d;
          });
          saveDevices();
          renderProducts();
        }
      
        // Update AC temp
        function updateACTemp(deviceId, newTemp) {
          devices = devices.map(d => {
            if (d.id === deviceId && d.type === "Air Conditioning") {
              return { ...d, acTemp: parseInt(newTemp) };
            }
            return d;
          });
          saveDevices();
          const tempLabel = document.getElementById(`tempLabel-${deviceId}`);
          if (tempLabel) {
            tempLabel.textContent = `${newTemp}°C`;
          }
        }
      
        // Listen for clicks in productsContainer
        productsContainer.addEventListener("click", (e) => {
          const target = e.target;
          const deviceIdAttr = target.getAttribute("data-id");
          if (!deviceIdAttr) return;
          const deviceId = parseInt(deviceIdAttr);
      
          // Edit
          if (target.classList.contains("edit-btn")) {
            if (userType === "homeManager") {
              openEditModal(deviceId);
            }
          }
          // Delete
          else if (target.classList.contains("delete-btn")) {
            if (userType === "homeManager") {
              if (confirm("Are you sure you want to delete this device?")) {
                devices = devices.filter(d => d.id !== deviceId);
                saveDevices();
                renderProducts();
              }
            }
          }
        });
      
        // Listen for changes on the iOS-style switch and AC slider
        productsContainer.addEventListener("change", (e) => {
          // iOS switch
          if (e.target.classList.contains("status-switch")) {
            const deviceId = parseInt(e.target.getAttribute("data-id"));
            toggleStatus(deviceId);
          }
          // AC slider
          else if (e.target.classList.contains("ac-slider")) {
            const deviceId = parseInt(e.target.getAttribute("data-id"));
            updateACTemp(deviceId, e.target.value);
          }
        });
      
        // Category navigation
        function initCategoryNav() {
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
              initCategoryNav();
              renderProducts();
            });
            categoryNav.appendChild(btn);
          });
        }
      
        // (Optional) If you have an edit modal, define openEditModal & closeEditModal
        // For simplicity, let's just do a prompt-based edit, or skip if you want a modal
        function openEditModal(deviceId) {
          const device = devices.find(d => d.id === deviceId);
          if (!device) return;
          const newName = prompt("New device name:", device.name) || device.name;
          const newRoom = prompt("New device room:", device.room) || device.room;
          const newInfo = prompt("New device info:", device.info) || device.info;
          devices = devices.map(d => {
            if (d.id === deviceId) {
              return { ...d, name: newName, room: newRoom, info: newInfo };
            }
            return d;
          });
          saveDevices();
          renderProducts();
        }
      
        // Initialize
        initCategoryNav();
        renderProducts();
      });
      
  
  function filterProducts(category) {
    let products = JSON.parse(localStorage.getItem('devices')) || [];
    if (category !== 'All') {
      products = products.filter(p => p.category === category);
    }
    displayProducts(products);
  }

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

  document.addEventListener("DOMContentLoaded", function () {
    let automationList = document.getElementById("automation-list");
    let automationText = document.getElementById("automation-text");
    let automationTable = document.getElementById("automation-table");
    let addDeviceAutomationBtn = document.getElementById("add-device-automation");
    let actionColumnHeader = document.querySelector("#automation-table thead tr th:last-child");

    let user = JSON.parse(localStorage.getItem("user")) || null;
    let userRole = user ? user.userType : "user"; // Default to normal user if no role

    function loadAutomations() {
        let automations = JSON.parse(localStorage.getItem("automations")) || [];
        // let filteredAutomations = automations.filter(auto => auto.homeId === homeId);
        let filteredAutomations = automations; // Use all automations for now

        automationList.innerHTML = "";

        if (filteredAutomations.length === 0) {
            automationTable.style.display = "none";
            addDeviceAutomationBtn.style.display = "none";
            
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
                addDeviceAutomationBtn.style.display = "none";
            }
            return;
        }

        automationText.innerHTML = "";
        automationTable.style.display = "table";
        addDeviceAutomationBtn.style.display = "block"; 
        
        if (userRole === "homeUser") {
            addDeviceAutomationBtn.style.display = "none"; // Hide add button for users
            actionColumnHeader.classList.add("hide-action-column"); // Hide action column header
        } else {
            addDeviceAutomationBtn.style.display = "block"; // Show for admins
        }

        filteredAutomations.forEach((automation, index) => {
            let row = document.createElement("tr");

            // Format the device information to include name and type
            let deviceInfo = automation.deviceName;
            if (automation.deviceType) {
                deviceInfo += ` (${automation.deviceType})`;
            }

            row.innerHTML = `
                <td>${deviceInfo}</td>
                <td>${automation.status}</td>
                <td>${formatTime(automation.start)}</td>
                <td>${formatTime(automation.end)}</td>
                <td><em> Admin</em></td>
                ${
                    userRole === "homeManager"
                        ? `<td><button class="delete-automation" data-index="${index}">Delete</button></td>`
                        : ""
                }
            `;

            automationList.appendChild(row);
        });

        document.querySelectorAll(".delete-automation").forEach(button => {
            button.addEventListener("click", function () {
                let index = this.getAttribute("data-index");
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

    // Updated the delete automation, this is very brute force but i essentially re-apply the "rule" when the automation is deleted
    // meaning automation is no longer active.
    function deleteAutomation(index) {
      let automations = JSON.parse(localStorage.getItem("automations")) || [];
      const automationToDelete = automations[index];
      
      // Check if the automation is currently active
      if (automationToDelete && automationToDelete.active) {
          const now = new Date();
          const currentHour = now.getHours();
          const currentMinute = now.getMinutes();
          
          // Parse start and end times
          const [startHour, startMinute] = automationToDelete.start.split(':').map(num => parseInt(num));
          const [endHour, endMinute] = automationToDelete.end.split(':').map(num => parseInt(num));
          
          // Calculate time in minutes for easier comparison
          const currentTimeInMinutes = currentHour * 60 + currentMinute;
          const startTimeInMinutes = startHour * 60 + startMinute;
          const endTimeInMinutes = endHour * 60 + endMinute;
          
          // Check if current time is within the automation period
          if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes) {
              // This automation is currently active, so reset the device status
              const devices = JSON.parse(localStorage.getItem("devices")) || [];
              const deviceToUpdate = devices.find(d => d.id === automationToDelete.deviceId);
              
              if (deviceToUpdate) {
                  // Reset the device to the opposite status of what the automation set
                  deviceToUpdate.status = automationToDelete.status === 'OFF';
                  
                  // Save the updated devices
                  localStorage.setItem("devices", JSON.stringify(devices));
                  console.log(`Device ${deviceToUpdate.name} status reset after automation deletion`);
                  
                  // If we're on the dashboard, refresh the UI
                  if (typeof renderProducts === "function") {
                      renderProducts();
                  }
              }
          }
      }
      
      // Add a fade-out animation
      const row = automationList.children[index];
      row.classList.add("fade-out");
      
      // Remove after animation completes
      setTimeout(() => {
          automations.splice(index, 1);
          localStorage.setItem("automations", JSON.stringify(automations));
          loadAutomations();
      }, 500); // Match with CSS animation duration
  }
    loadAutomations();
    

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
    
});



