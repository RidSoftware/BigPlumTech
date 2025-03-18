// Import the deviceAPI functions
import { getDevices, saveDevices, updateDevice } from './deviceAPI.js';

document.addEventListener("DOMContentLoaded", function () {
    const automationForm = document.getElementById("automation-form");
    const overlay = document.getElementById("confirmationOverlay");
    const confirmationMessage = document.getElementById("confirmation-message");
    const deviceListContainer = document.getElementById("device-list-container");
    const deviceTypeSelect = document.getElementById("device");
    
    // Load and display available devices
    function loadDevices() {
        // Use getDevices() from deviceAPI instead of directly accessing localStorage
        const devices = getDevices();
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
            deviceOption.dataset.room = device.room; // Add room data for display
            deviceOption.textContent = `${device.name} (${device.room})`;
            
            deviceOption.addEventListener("click", function() {
                // Remove selected class from all options
                document.querySelectorAll(".device-option").forEach(option => {
                    option.classList.remove("selected");
                });
                
                // Add selected class to clicked option
                this.classList.add("selected");
                
                // Update the selection display (for better UX feedback)
                updateDeviceSelectionDisplay(this.dataset.name, this.dataset.room);
            });
            
            deviceListContainer.appendChild(deviceOption);
        });
    }
    
    // Add a function to update the device selection display
    function updateDeviceSelectionDisplay(deviceName, deviceRoom) {
        const selectionDisplay = document.querySelector(".device-selection-display") || 
            createDeviceSelectionDisplay();
        
        selectionDisplay.textContent = `Selected: ${deviceName} (${deviceRoom})`;
        selectionDisplay.style.display = "block";
    }
    
    function createDeviceSelectionDisplay() {
        const selectionDisplay = document.createElement("div");
        selectionDisplay.className = "device-selection-display";
        selectionDisplay.style.marginTop = "10px";
        selectionDisplay.style.padding = "8px";
        selectionDisplay.style.backgroundColor = "#e3f2fd";
        selectionDisplay.style.borderRadius = "4px";
        selectionDisplay.style.fontWeight = "bold";
        
        // Insert after the device list container
        deviceListContainer.parentNode.insertBefore(selectionDisplay, deviceListContainer.nextSibling);
        
        return selectionDisplay;
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
        const deviceRoom = selectedDevice.dataset.room;
        const start = document.getElementById("start-time").value;
        const end = document.getElementById("end-time").value;
        const status = document.getElementById("status").value;
        
        // Validate time inputs
        if (!start || !end) {
            alert("Please select start and end times for the automation");
            return;
        }
        
        // Create automation object
        const automation = {
            id: Date.now(), // Unique ID for the automation
            deviceId,
            deviceName,
            deviceType,
            deviceRoom,
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
            <p>Your automation for <strong>${deviceName} (${deviceRoom})</strong> has been saved.</p>
            <p>It will turn <strong>${status}</strong> at <strong>${formatTime(start)}</strong> and turn <strong>${status === 'ON' ? 'OFF' : 'ON'}</strong> at <strong>${formatTime(end)}</strong> daily.</p>
            <button class="dashboard-btn" onclick="window.location.href='Dashboard.html'">
                Go to Dashboard →
            </button>
        `;

        if (devicesUpdated) {
            saveDevices(devices);
            
            // Dispatch a custom event that the dashboard can listen for
            const event = new CustomEvent("deviceStatusChanged", { detail: { updatedDevices: devices } });
            window.dispatchEvent(event);
            
            // Optional: Refresh the UI if we're on the dashboard
            if (window.location.href.includes("Dashboard.html") && typeof renderProducts === "function") {
                renderProducts();
            }
        }
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
    
    async function checkAutomations() {
        const automations = JSON.parse(localStorage.getItem("automations")) || [];
        if (automations.length === 0) return;
        
        // Get devices using the deviceAPI
        const devices = getDevices();
        const now = new Date();
        
        // Format time for comparison - now we get hours and minutes as numbers
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        let devicesUpdated = false;
        
        for (const automation of automations) {
            if (!automation.active) continue;
            
            // Parse start and end times to hours and minutes
            const [startHour, startMinute] = automation.start.split(':').map(num => parseInt(num));
            const [endHour, endMinute] = automation.end.split(':').map(num => parseInt(num));
            
            const deviceIndex = devices.findIndex(d => d.id === automation.deviceId);
            if (deviceIndex === -1) continue; // Device not found
            
            // Get the device
            const device = devices[deviceIndex];
            
            // Check if current time matches start time
            if (currentHour === startHour && currentMinute === startMinute) {
                // Set new status based on automation setting
                const newStatus = automation.status === 'ON';
                
                // Update local device first
                devices[deviceIndex].status = newStatus;
                devicesUpdated = true;
                
                // Then update via API (backend)
                try {
                    await updateDevice(device.id, { status: newStatus });
                    console.log(`Automation triggered: ${device.name} (${device.type}) turned ${automation.status} at ${currentHour}:${currentMinute}`);
                } catch (error) {
                    console.error(`Error updating device ${device.id}:`, error);
                }
                
                // Show notification
                showNotification(device.name, automation.status);
            } 
            else if (currentHour === endHour && currentMinute === endMinute) {
                // Set new status based on opposite of automation setting
                const newStatus = automation.status === 'OFF';
                
                // Update local device first
                devices[deviceIndex].status = newStatus;
                devicesUpdated = true;
                
                // Then update via API (backend)
                try {
                    await updateDevice(device.id, { status: newStatus });
                    console.log(`Automation triggered: ${device.name} (${device.type}) turned ${automation.status === 'ON' ? 'OFF' : 'ON'} at ${currentHour}:${currentMinute}`);
                } catch (error) {
                    console.error(`Error updating device ${device.id}:`, error);
                }
                
                // Show notification
                showNotification(device.name, automation.status === 'ON' ? 'OFF' : 'ON');
            }
        }
        
        // If any devices were updated, save changes locally
        if (devicesUpdated) {
            saveDevices(devices);
            
            // Optional: Refresh the UI if we're on the dashboard
            if (window.location.href.includes("Dashboard.html") && typeof renderProducts === "function") {
                renderProducts();
            }
        }
    }
    
    // Function to show notifications
    function showNotification(deviceName, status) {
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Smart Home Automation", {
                body: `${deviceName} has been turned ${status}`,
                icon: "/icon.png" // Update path as needed
            });
        }
    }
    
    // Apply styling to device options container
    function styleDeviceContainer() {
        deviceListContainer.style.maxHeight = "200px";
        deviceListContainer.style.overflowY = "auto";
        deviceListContainer.style.border = "1px solid #ccc";
        deviceListContainer.style.borderRadius = "4px";
        deviceListContainer.style.padding = "8px";
        deviceListContainer.style.marginTop = "5px";
    }
    
    // Style for device options
    const styleSheet = document.createElement("style");
    styleSheet.innerHTML = `
        .device-option {
            padding: 8px;
            margin: 4px 0;
            cursor: pointer;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        .device-option:hover {
            background-color: #e3f2fd;
        }
        .device-option.selected {
            background-color: #2196f3;
            color: white;
        }
        .no-devices {
            padding: 10px;
            color: #666;
            font-style: italic;
        }
    `;
    document.head.appendChild(styleSheet);
    
    // Create a global function to check automations that can be called from other pages
    window.checkAutomationsGlobal = checkAutomations;
    
    // Initialize
    styleDeviceContainer();
    loadDevices();
    setupAutomationChecker();
    automationForm.addEventListener("submit", saveAutomation);
});