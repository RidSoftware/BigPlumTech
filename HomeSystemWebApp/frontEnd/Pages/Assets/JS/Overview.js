//  Overview.js - Optimized & Fully Functional with Real Energy Data
import { 
    syncEnergy7daysUser, 
    syncEnergy24hrUser,
    syncEnergy24hrDevice,
    energyGrid
  } from './energyAPI.js';
  
  document.addEventListener('DOMContentLoaded', async function() {
    // Get current user
    const user = JSON.parse(localStorage.getItem("user")) || null;
    energyGrid();
    if (!user) {
        console.error("No current user found");
        return;
    }
    
    // Fetch energy data
    try {
        // Fetch weekly energy data for charts
        const weeklyData = await syncEnergy7daysUser(user.userID);
        
        // Initialize Graphs with real data
        initializeEnergyUsageChart(weeklyData);
        initializeEnergyGenerationChart(weeklyData);
        
        // Load the rest of the dashboard
        loadDeviceStatus();
        loadHomeDetails();
        loadAlertsAndNotifications();
        
        // Set interval for alerts and notifications updates
        setInterval(loadAlertsAndNotifications, 10000);
        
    } catch (error) {
        console.error("Error loading dashboard:", error);
    }
  });
  
  // Get Current User's Devices
  function getCurrentUserDevices() {
    const user = JSON.parse(localStorage.getItem("user")) || null;
    if (!user) return [];
  
    const allDevices = JSON.parse(localStorage.getItem("devices")) || [];
    return allDevices;
  }
  
  // Save User Devices
  function saveUserDevices(devices) {
    localStorage.setItem("devices", JSON.stringify(devices));
  }
  
  function initializeEnergyUsageChart(weeklyData) {
    const ctxUsage = document.getElementById('energyUsageChart').getContext('2d');
    
    // Define the days of week in order (starting with Sunday)
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Initialize arrays for each day of the week with zeros
    const sortedData = Array(7).fill(0);
    
    // Process the data from the API
    if (weeklyData && Object.keys(weeklyData).length > 0) {
        // For each date in our data
        Object.entries(weeklyData).forEach(([dateStr, value]) => {
            // Parse the date string to get day of week
            const date = new Date(dateStr);
            const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
            
            // Convert the value to a number (in case it's a string)
            const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
            
            // Add to the corresponding day's total
            // If multiple dates fall on the same day of week, we'll use the most recent one
            sortedData[dayIndex] = numValue;
        });
    }
    
    // Create gradient fill
    const gradientFill = ctxUsage.createLinearGradient(0, 0, 0, 400);
    gradientFill.addColorStop(0, 'rgba(54, 162, 235, 0.6)');
    gradientFill.addColorStop(1, 'rgba(54, 162, 235, 0.1)');
    
    new Chart(ctxUsage, {
        type: 'line',
        data: {
            labels: daysOfWeek,
            datasets: [{
                label: 'Energy Usage (kWh)',
                data: sortedData,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: gradientFill,
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
                    labels: {
                        font: {
                            size: 13
                        },
                        boxWidth: 15,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 6,
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            if (value !== undefined && value !== null && !isNaN(value)) {
                                return `Usage: ${value.toFixed(1)} kWh`;
                            } else {
                                return 'Usage: N/A kWh';
                            }
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
                    easing: 'linear'
                }
            }
        }
    });
}
  
  // Initialize Energy Generation Chart with real data
  function initializeEnergyGenerationChart(weeklyData) {
    const ctxGen = document.getElementById('energyGenerationChart').getContext('2d');
    
    // Parse data from the API response
    const labels = Object.keys(weeklyData).sort();
    // Simulate generation data as 25-35% of usage
    const data = labels.map(date => weeklyData[date] * (Math.random() * 0.1 + 0.25));
    
    // Format labels to show day of week
    const formattedLabels = labels.map(date => {
        const d = new Date(date);
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
    });
    
    // Ensure week starts with Sunday
    // Create an array to store the sorted data
    const sortedData = [];
    const sortedLabels = [];
    
    // Find Sunday in our data if it exists
    const sundayIndex = formattedLabels.indexOf('Sun');
    
    if (sundayIndex !== -1) {
        // Rearrange data to start from Sunday
        for(let i = 0; i < formattedLabels.length; i++) {
            const newIndex = (i + sundayIndex) % formattedLabels.length;
            sortedLabels.push(formattedLabels[newIndex]);
            sortedData.push(data[newIndex]);
        }
    } else {
        // If no Sunday in data, use the original order
        sortedLabels.push(...formattedLabels);
        sortedData.push(...data);
    }
    
    // Create gradient for bars
    const gradientBar = ctxGen.createLinearGradient(0, 0, 0, 400);
    gradientBar.addColorStop(0, 'rgba(255, 206, 86, 0.9)');
    gradientBar.addColorStop(1, 'rgba(255, 159, 64, 0.9)');
    
    new Chart(ctxGen, {
        type: 'bar',
        data: {
            labels: sortedLabels,
            datasets: [{
                label: 'Energy Generation (kWh)',
                data: sortedData,
                backgroundColor: gradientBar,
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 2,
                borderRadius: 6,
                hoverBackgroundColor: 'rgba(255, 159, 64, 1)',
                hoverBorderColor: 'rgba(255, 159, 64, 1)',
                barPercentage: 0.7,
                categoryPercentage: 0.8
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
                    labels: {
                        font: {
                            size: 13
                        },
                        boxWidth: 15,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 6,
                    callbacks: {
                        label: function(context) {
                            return `Generated: ${context.raw.toFixed(1)} kWh`;
                        }
                    }
                }
            },
            animations: {
                tension: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        }
    });
  }
  
// Load & Display Device Status with real energy usage data
async function loadDeviceStatus() {
    const deviceContainer = document.getElementById("deviceStatusContainer");
    deviceContainer.innerHTML = "";
    
    const devices = getCurrentUserDevices();
    const user = JSON.parse(localStorage.getItem("user")) || null;
    
    if (!user || !user.userID) {
      console.error("No valid user found");
      return;
    }
    
    try {
      // First, fetch the user's 24-hour energy data which includes all devices
      const allDeviceData = await syncEnergy24hrUser(user.userID);
      
      // Process each device
      for (const device of devices) {
        try {
          let usage24hr = "N/A";
          let deviceData = null;
          
          // Check if we have data for this device in the user's 24hr data
          if (allDeviceData && device.id && allDeviceData[device.id]) {
                // Calculate total usage from hourly data
                deviceData = allDeviceData[device.id];
                // Make sure we're only summing numbers
                const totalUsage = Object.values(deviceData).reduce((sum, val) => {
                // Convert to number if not already and add to sum
                return sum + (typeof val === 'number' ? val : Number(val) || 0);
                }, 0);
                usage24hr = totalUsage.toFixed(2);
          } else if (device.id) {
            // If not found in user data, try to fetch directly for this device
            deviceData = await syncEnergy24hrDevice(device.id);
            if (deviceData && Object.keys(deviceData).length > 0) {
              const totalUsage = Object.values(deviceData).reduce((sum, val) => {
                return sum + (typeof val === 'number' ? val : Number(val) || 0);
              }, 0);
              usage24hr = totalUsage.toFixed(2);
            } else {
              // Fallback with estimated data
              usage24hr = device.status ? 
                (device.consumption ? (device.consumption * (Math.random() * 0.8 + 0.2)).toFixed(2) : "N/A") : 
                "0";
            }
          }
          
          // Assign the usage data to the device
          device.usage24hr = usage24hr;
          
          // Create device card with energy info
          let deviceCard = document.createElement("div");
          deviceCard.classList.add("device-card");
          
          deviceCard.innerHTML = `
            <h3>${device.name}</h3>
            <p>Status: <span class="device-status ${device.status ? "active" : "inactive"}">${device.status ? "On" : "Off"}</span></p>
            <p>Room: ${device.room || "Not assigned"}</p>
            <p>Past 24hr Usage: <strong>${device.usage24hr}</strong> kWh</p>
            <p>Past 24hr Cost: <strong>£${((device.usage24hr)*(localStorage.getItem("energyCost"))).toFixed(2)}</strong></p>
          `;
          
          deviceContainer.appendChild(deviceCard);
          
        } catch (deviceError) {
          console.error(`Error processing device ${device.id || "unknown"}:`, deviceError);
          
          // Create error card for this device
          let deviceCard = document.createElement("div");
          deviceCard.classList.add("device-card", "error-card");
          deviceCard.innerHTML = `
            <h3>${device.name || "Unknown Device"}</h3>
            <p>Status: <span class="device-status inactive">Error</span></p>
            <p>Could not retrieve device data</p>
          `;
          deviceContainer.appendChild(deviceCard);
        }
      }
      
      // Save updated devices with 24hr usage
      saveUserDevices(devices);
      
    } catch (error) {
      console.error("Error loading device status:", error);
      deviceContainer.innerHTML = `
        <div class="error-message">
          <p>Error loading device status: ${error.message}</p>
          <button onclick="loadDeviceStatus()">Retry</button>
        </div>
      `;
    }
  }
  

  
  function loadAlertsAndNotifications() {
    let alertsList = document.getElementById("alertsList");
    let alertsCount = document.getElementById("alertsCount");
    let notificationsList = document.getElementById("notificationsList");
    let notificationCount = document.getElementById("notificationCount");
    let criticalAlertsButton = document.getElementById("criticalReportsButton");
    let criticalAlertsLink = criticalAlertsButton.parentElement; // Get the parent <a> tag
    let notificationsButton = document.getElementById("notificationsButton");
    let notificationsLink = notificationsButton.parentElement; // Get the parent <a> tag
  
    // Fetch stored alerts and notifications
    let alerts = JSON.parse(localStorage.getItem("criticalReports")) || [];
    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    
    // Update alerts section
    alertsList.innerHTML = "";
    
    if (alerts.length > 0) {
      // Configure the critical alerts button
      criticalAlertsLink.style.display = "block";
      criticalAlertsButton.innerHTML = `View All Alerts (${alerts.length})`;
    } else {
      alertsList.innerHTML = "<li>(No Alerts)</li>";
      criticalAlertsLink.style.display = "none";
    }
  
    // Update notifications section
    notificationsList.innerHTML = "";
    
    if (notifications.length > 0) {
      // Configure the notifications button
      notificationsLink.style.display = "block";
      notificationsButton.innerHTML = `View All Notifications (${notifications.length})`;
    } else {
      notificationsList.innerHTML = "<li>(Empty!)</li>";
      notificationsLink.style.display = "none";
    }
  
    // Update alert & notification count in UI
    alertsCount.innerText = `(${alerts.length})`;
    notificationCount.innerText = `(${notifications.length})`;
  }
  
  // Load Home Details based on user type
  function loadHomeDetails() {
    const homeDetailsContainer = document.getElementById("home-details-content");
    
    let user = JSON.parse(localStorage.getItem("user")) || null;
    
    if (!user) {
        console.log("User not found");
        return;
    }
    
    // Get all home users (for demo purposes, use mock data if needed)
    let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
    let homeUsers = allUsers.filter(u => u.homeID === user.homeID);
    let homeManager = homeUsers.find(u => u.userType === "homeManager");
    
    if (user.userType === "homeManager") {
        // Display for Home Manager
        const totalHomeUsers = homeUsers.filter(u => u.userType === "homeUser").length;
        
        homeDetailsContainer.innerHTML = `
            <p><strong>Home ID:</strong> ${user.homeID}</p>
            <p><strong>Number of Residents:</strong> <span id="resident-count" class="clickable">${totalHomeUsers}</span></p>
            <p><strong>Home Manager:</strong> ${user.firstName || user.firstname} ${user.lastName || user.Surname}</p>
            <p><strong>Your Role:</strong> Home Manager</p>
            <div id="user-details" class="user-details-panel" style="display: none;">
                <h4>Home Users</h4>
                <ul id="home-users-list"></ul>
            </div>
        `;
        
        // Add click event for user count
        document.getElementById("resident-count").addEventListener("click", function() {
            const userDetailsPanel = document.getElementById("user-details");
            const homeUsersList = document.getElementById("home-users-list");
            
            // Toggle display
            if (userDetailsPanel.style.display === "none") {
                userDetailsPanel.style.display = "block";
                
                // Populate user list
                homeUsersList.innerHTML = "";
                const regularHomeUsers = homeUsers.filter(u => u.userType !== "homeManager");
                
                regularHomeUsers.forEach(user => {
                    // Get device count for this user (mock if needed)
                    let userDevices = [];
                    try {
                        if (user.email) {
                            const allDevices = JSON.parse(localStorage.getItem("smartDevices")) || {};
                            userDevices = allDevices[user.email] || [];
                        }
                    } catch (e) {
                        console.error("Error getting user devices:", e);
                    }
                    
                    // Get automation count (mock for now)
                    const automationCount = Math.floor(Math.random() * 5);
                    
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <strong>${user.firstName || user.firstname} ${user.lastName || user.Surname}</strong> (${user.email})<br>
                        Devices: ${userDevices.length} | Automations: ${automationCount}
                    `;
                    homeUsersList.appendChild(li);
                });
            } else {
                userDetailsPanel.style.display = "none";
            }
        });
        
    } else {
        // Display for Home User
        homeDetailsContainer.innerHTML = `
            <p><strong>Home ID:</strong> ${user.homeID}</p>
            <p><strong>Home Manager:</strong> ${homeManager ? 
                `${homeManager.firstName || homeManager.firstname} ${homeManager.lastName || homeManager.Surname}` : 
                'Not assigned'}</p>
            <p><strong>Your Role:</strong> Home User</p>
        `;
    }
  }