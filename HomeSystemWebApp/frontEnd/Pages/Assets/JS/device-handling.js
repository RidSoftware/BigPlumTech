  // ----- API FUNCTIONS -----
  // Import API functions from deviceAPI.js
  import { getDevices, saveDevices, syncDevicesFromBackend, updateDevice, insertDevice, deleteDeviceBackend } from './deviceAPI.js';

document.addEventListener('DOMContentLoaded', async () => {
  // ----- USER TYPE LOGIC -----
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userID = user.id; // Get user ID for API calls
  const userType = user.userType || "homeUser"; // default if undefined
  const homeID = user.homeID; // Get home ID for adding new devices

  const productControllerText = document.getElementById("product-controller-text");
  if (userType === "homeUser") {
    productControllerText.textContent = 
      "You can monitor your smart devices here, but changes are restricted. Contact your Home Manager for modifications.";
  } else if (userType === "homeManager") {
    productControllerText.textContent = 
      "As a Home Manager, you have full control over all smart devices. Feel free to modify settings.";
  } else {
    productControllerText.textContent = "Manage your devices below:";
  }

  // ----- DOM Elements -----
  const deviceListContainer = document.querySelector('.device-list');
  const roomFilter = document.getElementById('roomFilter');
  const returnButton = document.getElementById('returnButton');

  // Add form
  const addProductForm = document.getElementById('addProductForm');
  const deviceNameEl = document.getElementById('deviceName');
  const deviceRoomEl = document.getElementById('deviceRoom');
  const deviceInfoEl = document.getElementById('deviceInfo');
  const deviceTypeEl = document.getElementById('deviceType');
  const acAddSliderGroup = document.getElementById('acAddSliderGroup');
  const acAddTempEl = document.getElementById('acAddTemp');
  const acAddTempValueEl = document.getElementById('acAddTempValue');

  // Edit modal
  const editModal = document.getElementById('editModal');
  const closeEditModalBtn = document.getElementById('closeEditModal');
  const editDeviceForm = document.getElementById('editDeviceForm');
  const overlay = document.getElementById('confirmationOverlay');

  // Edit form fields
  const editNameEl = document.getElementById('editName');
  const editRoomEl = document.getElementById('editRoom');
  const editInfoEl = document.getElementById('editInfo');
  const editTypeEl = document.getElementById('editType');
  const acEditSliderGroup = document.getElementById('acEditSliderGroup');
  const acEditTempEl = document.getElementById('acEditTemp');
  const acEditTempValueEl = document.getElementById('acEditTempValue');

  let editingDeviceId = null;
  let devices = [];


  // ----- LOAD DEVICES -----
  async function loadDevices() {
    // First try to get from localStorage
    devices = getDevices();
    
    // Then sync with backend
    if (userID) {
      try {
        await syncDevicesFromBackend(userID);
        // Refresh local devices after sync
        devices = getDevices();
      } catch (error) {
        console.error("Error syncing devices:", error);
      }
    } else {
      console.warn("No user ID found. Using local devices only.");
    }
    
    renderDevices();
  }

  // Input validation function
  function valid(device) {
    const blacklist = ["'", '"', "\\0", "\\n", "\\r", "\\", "\\Z", "--", ";", "/*", "\\*", "(", ")", "=", "|", "%", "_"];
    
    for (let i = 0; i < blacklist.length; i++) {
      if (device.includes(blacklist[i])) {
        return 0;
      }
    }
    return 1;
  }

  // ----- RENDER DEVICES -----
  function renderDevices() {
    deviceListContainer.innerHTML = '';
    let filtered = devices;
    const filterValue = roomFilter.value.toLowerCase();

    if (filterValue !== 'all') {
      filtered = devices.filter(d => d.room.toLowerCase() === filterValue);
    }

    if (filtered.length === 0) {
      // Show "No devices added in this section"
      deviceListContainer.innerHTML = '<p>No devices added in this section</p>';
      return;
    }

    filtered.forEach(device => {
      const item = document.createElement('div');
      item.className = 'device-item';

      const statusLabel = device.status ? 'Turn Off' : 'Turn On';
      const statusText = device.status ? 'Online' : 'Offline';

      // Build HTML
      let deviceHTML = `
        <div class="device-info">
          <h3>${device.name}</h3>
          <p><strong>Room:</strong> ${device.room}</p>
          <p><strong>Info:</strong> ${device.info || "No additional info"}</p>
      `;

      // If AC, show temperature
      if (device.type === 'Air Conditioning') {
        // If no temp set yet, default to 24
        const acTemp = device.acTemp ?? 24;
        deviceHTML += `<p><strong>AC Temp:</strong> ${acTemp}°C</p>`;
      }

      deviceHTML += `
          <p><strong>Status:</strong> ${statusText}</p>
        </div>
        <div class="device-actions">
          <button class="toggle-btn" data-id="${device.id}">${statusLabel}</button>
      `;

      // If user is homeManager, show Edit & Delete
      if (userType === "homeManager") {
        deviceHTML += `
          <button class="edit-btn" data-id="${device.id}">Edit</button>
          <button class="delete-btn" data-id="${device.id}">Delete</button>
        `;
      }

      deviceHTML += `</div>`; // close device-actions
      item.innerHTML = deviceHTML;
      deviceListContainer.appendChild(item);
    });
  }

  // ----- TOGGLE DEVICE ON/OFF -----
  async function toggleDevice(id) {
    try {
      // Find the device to toggle
      const device = devices.find(d => d.id === id);
      if (!device) return;
      
      // Toggle status
      const newStatus = !device.status;
      
      // Update backend first
      await updateDevice(id, { status: newStatus });
      
      // If successful, update local devices
      devices = devices.map(d => {
        if (d.id === id) {
          return { ...d, status: newStatus };
        }
        return d;
      });
      
      // Save to local storage
      saveDevices(devices);
      
      // Rerender UI
      renderDevices();
    } catch (error) {
      console.error(`Error toggling device ${id}:`, error);
      alert("Failed to update device status. Please try again.");
    }
  }

  // ----- DELETE DEVICE -----
  async function deleteDevice(id) {
    try {
      // Delete from backend first
      await deleteDeviceBackend(id);
      
      // If successful, update local devices
      devices = devices.filter(d => d.id !== id);
      
      // Save to local storage
      saveDevices(devices);
      
      // Rerender UI
      renderDevices();
    } catch (error) {
      console.error(`Error deleting device ${id}:`, error);
      alert("Failed to delete device. Please try again.");
    }
  }

  // ----- OPEN EDIT MODAL -----
  function openEditModal(id) {
    editingDeviceId = id;
    const device = devices.find(d => d.id === id);
    if (!device) return;

    editNameEl.value = device.name;
    editRoomEl.value = device.room;
    editInfoEl.value = device.info || '';
    editTypeEl.value = device.type;

    // If AC, show slider group
    if (device.type === 'Air Conditioning') {
      acEditSliderGroup.classList.remove('hidden');
      acEditTempEl.value = device.acTemp ?? 24;
      acEditTempValueEl.textContent = `${acEditTempEl.value}°C`;
    } else {
      acEditSliderGroup.classList.add('hidden');
    }

    // Show modal & overlay
    editModal.classList.remove('hidden');
    editModal.style.display = 'flex';
    overlay.style.display = 'block';
  }

  // ----- CLOSE EDIT MODAL -----
  function closeEditModal() {
    editModal.classList.add('hidden');
    editModal.style.display = 'none';
    overlay.style.display = 'none';
    editingDeviceId = null;
  }
  closeEditModalBtn.addEventListener('click', closeEditModal);

  // ----- EDIT FORM SUBMIT -----
  editDeviceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const updatedName = editNameEl.value;
    const updatedRoom = editRoomEl.value;
    const updatedInfo = editInfoEl.value;
    const updatedType = editTypeEl.value;
    const updatedTemp = acEditTempEl.value; // only relevant if AC

    try {
      // Build updated fields object to send to API
      const updatedFields = {
        name: updatedName,
        room: updatedRoom,
        type: updatedType
      };

      // Update backend first
      await updateDevice(editingDeviceId, updatedFields);
      
      // If successful, update local devices
      devices = devices.map(d => {
        if (d.id === editingDeviceId) {
          const updatedDevice = {
            ...d,
            name: updatedName,
            room: updatedRoom,
            info: updatedInfo,
            type: updatedType
          };
          // If AC, store temp
          if (updatedType === 'Air Conditioning') {
            updatedDevice.acTemp = parseInt(updatedTemp);
          } else {
            delete updatedDevice.acTemp;
          }
          return updatedDevice;
        }
        return d;
      });
      
      // Save to local storage
      saveDevices(devices);
      
      // Rerender UI and close modal
      renderDevices();
      closeEditModal();
    } catch (error) {
      console.error(`Error updating device ${editingDeviceId}:`, error);
      alert("Failed to update device. Please try again.");
    }
  });

  // ----- EDIT SLIDER EVENT -----
  acEditTempEl.addEventListener('input', () => {
    acEditTempValueEl.textContent = `${acEditTempEl.value}°C`;
  });

  // ----- DEVICE LIST ACTIONS (TOGGLE, EDIT, DELETE) -----
  deviceListContainer.addEventListener('click', (e) => {
    const target = e.target;
    const deviceId = parseInt(target.getAttribute('data-id'));
    if (!deviceId) return;

    // Toggle
    if (target.classList.contains('toggle-btn')) {
      toggleDevice(deviceId);
    }
    // Edit
    else if (target.classList.contains('edit-btn')) {
      if (userType === "homeManager") {
        openEditModal(deviceId);
      }
    }
    // Delete
    else if (target.classList.contains('delete-btn')) {
      if (userType === "homeManager") {
        if (confirm('Are you sure you want to delete this device?')) {
          deleteDevice(deviceId);
        }
      }
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const addProductForm = document.getElementById("addProductForm");
    const confirmationOverlay = document.getElementById("confirmationOverlay");
    const confirmationMessage = document.getElementById("confirmationMessage");
    const continueButton = document.getElementById("continueButton");
  
    addProductForm.addEventListener("submit", (event) => {
      event.preventDefault();
  
      // Simulating device addition logic
      setTimeout(() => {
        showConfirmation();
      }, 500); // Simulating delay for better UX
    });
  
    function showConfirmation() {
      confirmationOverlay.classList.remove("hidden");
      confirmationMessage.classList.remove("hidden");
    }
  
    continueButton.addEventListener("click", () => {
      confirmationOverlay.classList.add("hidden");
      confirmationMessage.classList.add("hidden");
      addProductForm.reset();
    });
  });
  

  // ----- ADD PRODUCT FORM SUBMIT -----
addProductForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Reset validation error states
  document.getElementById("nameValid").innerHTML = ``;
  document.getElementById("infoValid").innerHTML = ``;
  document.getElementById("deviceName").style.outline = "";
  document.getElementById("deviceInfo").style.outline = "";

  const name = deviceNameEl.value.trim();
  const room = deviceRoomEl.value;
  const info = deviceInfoEl.value.trim() || "No additional info";
  const type = deviceTypeEl.value;
  const status = false; // Default to Off for new devices
  const acTemp = parseInt(acAddTempEl.value); // only relevant if AC

  const nv = document.getElementById("nameValid");
  const iv = document.getElementById("infoValid");

  // Validate input
  if(valid(name) == 1 && valid(info) == 1) {
      try {
          // Make sure we have homeID
          if (!homeID) {
              throw new Error("No homeID found in user data. Cannot add device.");
          }
          
          // Create new device object to send to API
          const newDeviceData = {
              name: name,
              room: room,
              info: info,
              type: type,
              status: status,
              homeID: parseInt(homeID)
          };
          
          console.log("Sending new device data:", newDeviceData);
          
          // Insert to backend and get the returned device with ID
          const addedDevice = await insertDevice(newDeviceData);
          
          if (!addedDevice || !addedDevice.id) {
              throw new Error("Failed to add device - invalid response from server");
          }
          
          console.log("Device added to database with ID:", addedDevice.id);
          
          // First, get the latest devices from localStorage
          let currentDevices = getDevices();
          
          // Create a complete device object
          const completeDevice = {
              ...addedDevice,
              info: info // Ensure info is included
          };
          
          // Add temperature if it's an AC
          if (type === 'Air Conditioning') {
              completeDevice.acTemp = acTemp;
          }
          
          // Add the new device to our devices array
          currentDevices.push(completeDevice);
          
          // Save updated devices to local storage
          saveDevices(currentDevices);
          
          // Update our local devices variable
          devices = currentDevices;
          
          // Reset form
          addProductForm.reset();
          
          // Hide AC slider group
          acAddSliderGroup.classList.add('hidden');
          
          // Refresh device display
          renderDevices();
          
          // Show success message
          alert("Device added successfully!");
          
      } catch (error) {
          console.error("Error adding device:", error);
          alert(`Failed to add device: ${error.message}`);
      }
  } else if(valid(name) == 0 && valid(info) == 1) {
      // Invalid name
      document.getElementById("deviceName").style.outline = "3px solid red";
      nv.style.color = "red";
      nv.innerHTML = `<div id="nameValid" style="color:red">Invalid Name</div>`;
  } else if(valid(info) == 0 && valid(name) == 1) {
      // Invalid info
      document.getElementById("deviceInfo").style.outline = "3px solid red";
      iv.style.color = "red";
      iv.innerHTML = `<div id="infoValid" style="color:red">Invalid Info</div>`;
  } else {
      // Both invalid
      document.getElementById("deviceName").style.outline = "3px solid red";
      document.getElementById("deviceInfo").style.outline = "3px solid red";
      nv.style.color = "red";
      nv.innerHTML = `<div id="nameValid" style="color:red">Invalid Name</div>`;
      iv.style.color = "red";
      iv.innerHTML = `<div id="infoValid" style="color:red">Invalid Info</div>`;
  }
});
  // ----- AC ADD SLIDER EVENTS -----
  deviceTypeEl.addEventListener('change', () => {
    if (deviceTypeEl.value === 'Air Conditioning') {
      acAddSliderGroup.classList.remove('hidden');
      acAddTempValueEl.textContent = `${acAddTempEl.value}°C`;
    } else {
      acAddSliderGroup.classList.add('hidden');
    }
  });
  
  acAddTempEl.addEventListener('input', () => {
    acAddTempValueEl.textContent = `${acAddTempEl.value}°C`;
  });

  // ----- ROOM FILTER -----
  roomFilter.addEventListener('change', () => {
    renderDevices();
  });

  // ----- RETURN BUTTON -> DASHBOARD -----
  returnButton.addEventListener('click', () => {
    window.location.href = 'Dashboard.html';
  });

  // ----- INITIAL LOAD -----
  await loadDevices();
});