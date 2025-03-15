document.addEventListener("DOMContentLoaded", function () {
    const automationForm = document.getElementById("automation-form");
    const overlay = document.getElementById("confirmationOverlay");
    const confirmationMessage = document.getElementById("confirmation-message");
    const deviceListContainer = document.getElementById("device-list-container");
    const deviceTypeSelect = document.getElementById("device");
    
    // Load and display available devices
    function loadDevices() {
        const devices = JSON.parse(localStorage.getItem("devices")) || [];
        const deviceType = deviceTypeSelect.value;
        
        // Filter devices by selected type
        const filteredDevices = devices.filter(device => device.type === deviceType);
        
        // Clear previous device list
        deviceListContainer.innerHTML = '';
        
        if (filteredDevices.length === 0) {
            deviceListContainer.innerHTML = '<div class="no-devices">No devices of this type available</div>';
            return;
        }
        
        // Create device options
        filteredDevices.forEach(device => {
            const deviceOption = document.createElement("div");
            deviceOption.className = "device-option";
            deviceOption.dataset.id = device.id;
            deviceOption.dataset.name = device.name;
            deviceOption.dataset.type = device.type;
            deviceOption.textContent = `${device.name} (${device.room})`;
            
            deviceOption.addEventListener("click", function() {
                // Remove selected class from all options
                document.querySelectorAll(".device-option").forEach(option => {
                    option.classList.remove("selected");
                });
                
                // Add selected class to clicked option
                this.classList.add("selected");
            });
            
            deviceListContainer.appendChild(deviceOption);
        });
    }
    
    // Update device list when device type changes
    deviceTypeSelect.addEventListener("change", loadDevices);
    
    function saveAutomation(event) {
        event.preventDefault();
        
        // Get selected device
        const selectedDevice = document.querySelector(".device-option.selected");
        if (!selectedDevice) {
            alert("Please select a specific device for automation");
            return;
        }
        
        const deviceId = parseInt(selectedDevice.dataset.id);
        const deviceName = selectedDevice.dataset.name;
        const deviceType = selectedDevice.dataset.type;
        const start = document.getElementById("start-time").value;
        const end = document.getElementById("end-time").value;
        const status = document.getElementById("status").value;
        
        // Create automation object
        const automation = {
            id: Date.now(), // Unique ID for the automation
            deviceId,
            deviceName,
            deviceType,
            start,
            end,
            status,
            created: new Date().toISOString(),
            active: true
        };
        
        // Save to localStorage
        let automations = JSON.parse(localStorage.getItem("automations")) || [];
        automations.push(automation);
        localStorage.setItem("automations", JSON.stringify(automations));

        // Show Overlay and Confirmation Message
        overlay.style.display = "block";
        confirmationMessage.style.display = "flex";

        // Add Confirmation Message Content
        confirmationMessage.innerHTML = `
            <h2>Automation Setup Completed!</h2>
            <p>Your automation for <strong>${deviceName} (${deviceType})</strong> has been saved.</p>
            <p>It will turn <strong>${status}</strong> at <strong>${formatTime(start)}</strong> and turn <strong>${status === 'ON' ? 'OFF' : 'ON'}</strong> at <strong>${formatTime(end)}</strong> daily.</p>
            <button class="dashboard-btn" onclick="window.location.href='Dashboard.html'">
                Go to Dashboard →
            </button>
        `;
    }
    
    // Format time for display (convert 24h to 12h format)
    function formatTime(time24) {
        const [hours, minutes] = time24.split(':');
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12}:${minutes} ${period}`;
    }

    // Set up automation checker - run immediately and then every minute
    function setupAutomationChecker() {
        // Check automations every 10 seconds (increased frequency for testing)
        setInterval(checkAutomations, 10000);
        
        // Also check immediately when page loads
        checkAutomations();
    }
    
    function checkAutomations() {
        const automations = JSON.parse(localStorage.getItem("automations")) || [];
        if (automations.length === 0) return;
        
        const devices = JSON.parse(localStorage.getItem("devices")) || [];
        const now = new Date();
        
        // Format time for comparison - now we get hours and minutes as numbers
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        let devicesUpdated = false;
        
        automations.forEach(automation => {
            if (!automation.active) return;
            
            // Parse start and end times to hours and minutes
            const [startHour, startMinute] = automation.start.split(':').map(num => parseInt(num));
            const [endHour, endMinute] = automation.end.split(':').map(num => parseInt(num));
            
            // Check if current time matches start time
            if (currentHour === startHour && currentMinute === startMinute) {
                const device = devices.find(d => d.id === automation.deviceId);
                if (!device) return; // Device not found
                
                // Update device status based on automation setting (ON or OFF)
                device.status = automation.status === 'ON';
                devicesUpdated = true;
                
                console.log(`Automation triggered: ${device.name} (${device.type}) turned ${automation.status} at ${currentHour}:${currentMinute}`);
                
                // Optional: Show a notification to the user (but tbh idk how do i implement this)
                if ("Notification" in window && Notification.permission === "granted") {
                    new Notification("Smart Home Automation", {
                        body: `${device.name} has been turned ${automation.status}`,
                        icon: "/icon.png" //if want to
                    });
                }
            } 
            else if (currentHour === endHour && currentMinute === endMinute) {
                const device = devices.find(d => d.id === automation.deviceId);
                if (!device) return; // Device not found
                
                // Update device status to opposite of start status
                device.status = automation.status === 'OFF';
                devicesUpdated = true;
                
                console.log(`Automation triggered: ${device.name} (${device.type}) turned ${automation.status === 'ON' ? 'OFF' : 'ON'} at ${currentHour}:${currentMinute}`);
                
                // Optional: Show a notification to the user - same here
                if ("Notification" in window && Notification.permission === "granted") {
                    new Notification("Smart Home Automation", {
                        body: `${device.name} has been turned ${automation.status === 'ON' ? 'OFF' : 'ON'}`,
                        icon: "/path/to/icon.png" // Optional
                    });
                }
            }
        });
        
        // Save updated devices if any changes were made
        if (devicesUpdated) {
            localStorage.setItem("devices", JSON.stringify(devices));
            console.log("Devices updated due to automation rules");
            
            // Optional: Refresh the UI if we're on the dashboard
            if (window.location.href.includes("Dashboard.html") && typeof renderProducts === "function") {
                renderProducts();
            }
        }
    }
    
    // Create a global function to check automations that can be called from other pages
    window.checkAutomationsGlobal = checkAutomations;
    
    // Initialize
    loadDevices();
    setupAutomationChecker();
    automationForm.addEventListener("submit", saveAutomation);
});