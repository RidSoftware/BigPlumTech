document.addEventListener('DOMContentLoaded', () => {
  // ----- USER TYPE LOGIC -----
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userType = user.userType || "homeUser"; // default if undefined

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

  // ----- LOAD OR CREATE devices in localStorage -----
  let devices = JSON.parse(localStorage.getItem('devices')) || [
    // fallback if none
    { id: 1, name: 'Light', room: 'Living Room', info: 'Default info', type: 'Light', status: true },
    { id: 2, name: 'Robot', room: 'Bedroom', info: 'Default info', type: 'Robot', status: false },
  ];

  // Save to localStorage
  function saveDevices() {
    localStorage.setItem('devices', JSON.stringify(devices));
  }

  function valid(device){
		const blacklist = ["'", '"', "\\0", "\\n", "\\r", "\\", "\\Z", "--", ";", "/*", "\\*", "(", ")", "=", "|", "%", "_"]; //list of common escape characters, a slash has been added before each so the second slashes can be recognised 
		//var device = document.getElementById("deviceName").value;
    
    
		for(let i = 0; i < blacklist.length; i++){
		//looping through each member of list, if any match then we reject it.
		
		if(device.includes(blacklist[i])){
			//document.getElementById("accepted").innerHTML = "Not Valid"
      
			return 0;

		}
	}		//in later build this would also include the actual data being sent to database, but here is just pure example input validation for database
			//document.getElementById("accepted").innerHTML = "accepted"
      
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
  function toggleDevice(id) {
    devices = devices.map(d => {
      if (d.id === id) {
        return { ...d, status: !d.status };
      }
      return d;
    });
    saveDevices();
    renderDevices();
  }

  // ----- DELETE DEVICE -----
  function deleteDevice(id) {
    devices = devices.filter(d => d.id !== id);
    saveDevices();
    renderDevices();
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
  editDeviceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedName = editNameEl.value;
    const updatedRoom = editRoomEl.value;
    const updatedInfo = editInfoEl.value;
    const updatedType = editTypeEl.value;
    const updatedTemp = acEditTempEl.value; // only relevant if AC

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
    saveDevices();
    renderDevices();
    closeEditModal();
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

  // ----- ADD PRODUCT FORM SUBMIT -----
  addProductForm.addEventListener('submit', (e) => {

    //resetting fields to non error state
    document.getElementById("nameValid").innerHTML = ``;
    document.getElementById("infoValid").innerHTML = ``;

    document.getElementById("deviceName").style.outline = "#555";
    document.getElementById("deviceInfo").style.outline = "#555";

    e.preventDefault();
    const name = deviceNameEl.value;
    const room = deviceRoomEl.value;
    const info = deviceInfoEl.value;
    const type = deviceTypeEl.value;
    const acTemp = parseInt(acAddTempEl.value); // only relevant if AC

    // Generate new ID
    const newId = devices.length ? Math.max(...devices.map(d => d.id)) + 1 : 1;
    const newDevice = {
      id: newId,
      name,
      room,
      info,
      type,
      status: false
    };

    // If AC, store temperature
    if (type === 'Air Conditioning') {
      newDevice.acTemp = acTemp;
    }
    const nv = document.getElementById("nameValid");
    const iv = document.getElementById("infoValid");

    //1 means parameter is valid 0 means invalid

    if(valid(name) == 1 && valid(info) == 1){
      devices.push(newDevice);
      saveDevices();
      addProductForm.reset();
    // Hide AC slider group
      acAddSliderGroup.classList.add('hidden');
      renderDevices();
      
    } else if(valid(name) == 0 && valid(info) == 1){
        //changes text box outline to red and produces a red error message
        document.getElementById("deviceName").style.outline = "3px solid red";
        nv.style.color = "red";
        nv.innerHTML = `<div = "nameValid" color = "red"> Invalid Name </div>`;

    } else if(valid(info) == 0 && valid(name) == 1){

        document.getElementById("deviceInfo").style.outline = "3px solid red";
        iv.style.color = "red";
        iv.innerHTML = `<div = "infoValid" color = "red"> Invalid Info </div>`;

    }else{

        document.getElementById("deviceName").style.outline = "3px solid red";
        document.getElementById("deviceInfo").style.outline = "3px solid red";

        nv.style.color = "red";
        nv.innerHTML = `<div = "nameValid" color = "red"> Invalid Name </div>`;
        iv.style.color = "red";
        iv.innerHTML = `<div = "infoValid" color = "red"> Invalid Info </div>`;

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

  // ----- INITIAL RENDER -----
  renderDevices();
});
