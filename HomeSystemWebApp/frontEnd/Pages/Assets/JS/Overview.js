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
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let lastLoggedInEmail = localStorage.getItem("lastLoggedInEmail") || null;
    let currentUser = users.find(user => user.email === lastLoggedInEmail);
  
    if (!currentUser) return [];
  
    let allDevices = JSON.parse(localStorage.getItem("smartDevices")) || {};
    return allDevices[currentUser.email] || [];
  }
  
  //Save User Devices
  function saveUserDevices(devices) {
    let lastLoggedInEmail = localStorage.getItem("lastLoggedInEmail");
    let allDevices = JSON.parse(localStorage.getItem("smartDevices")) || {};
    allDevices[lastLoggedInEmail] = devices;
    localStorage.setItem("smartDevices", JSON.stringify(allDevices));
  }
  
  //Initialize Energy Usage Chart 
  function initializeEnergyUsageChart() {
    const ctxUsage = document.getElementById('energyUsageChart').getContext('2d');
    
    // Create gradient fill
    const gradientFill = ctxUsage.createLinearGradient(0, 0, 0, 400);
    gradientFill.addColorStop(0, 'rgba(54, 162, 235, 0.6)');
    gradientFill.addColorStop(1, 'rgba(54, 162, 235, 0.1)');
    
    new Chart(ctxUsage, {
        type: 'line',
        data: {
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{
                label: 'Energy Usage (kWh)',
                data: [20, 25, 22, 30, 28, 26, 24],
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
                    easing: 'linear'
                }
            }
        }
    });
  }
  
  
  //Initialize Energy Generation Chart 
  function initializeEnergyGenerationChart() {
    const ctxGen = document.getElementById('energyGenerationChart').getContext('2d');
    
    // Create gradient for bars
    const gradientBar = ctxGen.createLinearGradient(0, 0, 0, 400);
    gradientBar.addColorStop(0, 'rgba(255, 206, 86, 0.9)');
    gradientBar.addColorStop(1, 'rgba(255, 159, 64, 0.9)');
    
    new Chart(ctxGen, {
        type: 'bar',
        data: {
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{
                label: 'Energy Generation (kWh)',
                data: [5, 7, 6, 8, 7, 9, 6],
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
                            return `Generated: ${context.raw} kWh`;
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
    let lastLoggedInEmail = localStorage.getItem("lastLoggedInEmail");
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUser = users.find(user => user.email === lastLoggedInEmail);
  
    let devideHandlingButton = document.getElementById("device-handling-btn");
  
    if (currentUser.userType !== "homeManager") {
      devideHandlingButton.style.display = "none";
    } else {
      devideHandlingButton.style.display = "block";
    }
  }