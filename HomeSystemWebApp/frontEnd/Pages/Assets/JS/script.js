document.addEventListener("DOMContentLoaded", function () {
    initializeChart();
    updateEnergyPanel();
    makePanelDraggable();
});

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
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let lastLoggedInEmail = localStorage.getItem("lastLoggedInEmail") || null;
  let currentUser = users.find(user => user.email === lastLoggedInEmail);
  
  const energyPanel = document.getElementById("energy-panel");

  if (!currentUser) {
      console.warn("No user found, hiding energy panel.");
      energyPanel.style.display = "none";
      return;
  }

  // Show draggable panel only if the user is a regular "user"
  if (currentUser.userType === "homeUser") {
      energyPanel.style.display = "block"; // Make it visible
      enableDrag(energyPanel); // Ensure it's draggable
  } else {
      energyPanel.style.display = "none"; // Hide for homeManager
  }
});


document.addEventListener('DOMContentLoaded', () => {
    // Load products from localStorage or initialize with default products
    let products = JSON.parse(localStorage.getItem('products'));
    if (!products) {
      products = [
        { name: 'Light', category: 'Living Room', type: 'Light' },
        { name: 'Light', category: 'Kitchen', type: 'Light' },
        { name: 'Air Conditioning', category: 'Bedroom', type: 'Air Conditioning' }
      ];
      localStorage.setItem('products', JSON.stringify(products));
    }
    
    // Preset categories
    const categories = ['All', 'Living Room', 'Kitchen', 'Bedroom'];
  
    // Build category buttons
    const categoryNav = document.getElementById('categoryNav');
    categories.forEach(category => {
      const button = document.createElement('button');
      button.textContent = category;
      button.classList.add('category-button');
      button.addEventListener('click', () => filterProducts(category));
      categoryNav.appendChild(button);
    });
  
    // Initially display all products (plus the add-new product card)
    displayProducts(products);
  
    
  //   // Fetch data dynamically
  //   async function fetchEnergyData() {
  //       try {
  //           const response = await fetch("/api/energy/hourly");
  //           const data = await response.json();
    
  //           myChart.data.labels = data.hours;
  //           myChart.data.datasets[0].data = data.usage;
  //           myChart.update();
  //       } catch (error) {
  //           console.error("Error fetching energy data:", error);
  //       }
  //   }
    
  //   // Fetch data on page load
  //   fetchEnergyData();

  //   async function fetchSmartProducts() {
  //     try {
  //         const response = await fetch("/api/user/products"); // Fetch user-specific products
  //         const data = await response.json();
  
  //         const productsContainer = document.getElementById("productsContainer");
  //         productsContainer.innerHTML = ""; // Clear existing products
  
  //         data.products.forEach(product => {
  //             const productCard = document.createElement("div");
  //             productCard.classList.add("productCard");
  //             productCard.innerHTML = `
  //                 <p>${product.name}</p>
  //                 <span>${product.category}</span>
  //             `;
  //             productsContainer.appendChild(productCard);
  //         });
  //     } catch (error) {
  //         console.error("Error fetching products:", error);
  //     }
  // }
  
  // Fetch on page load
  fetchSmartProducts();
  
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dataThisWeek = [20, 30, 35, 50, 51, 40, 35];
    const dataLastWeek = [15, 25, 28, 35, 45, 35, 30];
  
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'This Week',
            data: dataThisWeek,
            borderColor: 'rgba(59,130,246,1)',
            backgroundColor: 'rgba(59,130,246,0.1)',
            fill: true,
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 4,
            pointBorderWidth: 2,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: 'rgba(59,130,246,1)'
          },
          {
            label: 'Last Week',
            data: dataLastWeek,
            borderColor: 'rgba(192,192,192,0.7)',
            backgroundColor: 'rgba(192,192,192,0.1)',
            fill: true,
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 4,
            pointBorderWidth: 2,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: 'rgba(192,192,192,0.7)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false }, ticks: { color: '#555' } },
          y: {
            beginAtZero: true,
            max: 60,
            grid: { color: 'rgba(220,220,220,0.3)', drawBorder: false },
            ticks: { color: '#555' }
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
                return context.parsed.y;
              }
            }
          }
        }
      }
    });
  });
  
  function displayProducts(productList) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    productList.forEach(product => {
        let card = document.createElement('div');
        card.classList.add('productCard');

        // Product Icon
        let icon;
        if (product.type === 'Light') {
            icon = "💡"; // Lightbulb icon
        } else if (product.type === 'Air Conditioning') {
            icon = "❄️"; // AC icon
        } else if (product.type === 'Curtain') {
            icon = "🏠"; // Curtain icon
        } else {
            icon = "🔌"; // Default icon
        }

        // Build card UI
        card.innerHTML = `
            <div class="product-header">
                <span class="product-icon">${icon}</span>
                <h3>${product.name}</h3>
            </div>
            <p class="product-category">${product.category}</p>
            <label class="switch">
                <input type="checkbox" class="toggle" data-id="${product.id}" ${product.status ? 'checked' : ''}>
                <span class="slider round"></span>
            </label>
        `;

        // If the product is an AC, add a temperature slider
        if (product.type === "Air Conditioning") {
            let slider = document.createElement('input');
            slider.type = "range";
            slider.min = "14";
            slider.max = "30";
            slider.step = "1";
            slider.value = product.temperature || "22";
            slider.classList.add("temperature-slider");

            let tempLabel = document.createElement("div");
            tempLabel.classList.add("temp-label");
            tempLabel.innerText = `${slider.value}°C`;

            slider.addEventListener("input", function () {
                tempLabel.innerText = `${this.value}°C`;
                product.temperature = this.value;
                localStorage.setItem("smartDevices", JSON.stringify(productList));
            });

            card.appendChild(tempLabel);
            card.appendChild(slider);
        }

        container.appendChild(card);

        function getCurrentUserDevices() {
          let users = JSON.parse(localStorage.getItem("users")) || [];
          let lastLoggedInEmail = localStorage.getItem("lastLoggedInEmail") || null;
          let currentUser = users.find(user => user.email === lastLoggedInEmail);
      
          if (!currentUser) return [];
      
          // Retrieve devices linked to this user's email
          let allDevices = JSON.parse(localStorage.getItem("smartDevices")) || {};
          return allDevices[currentUser.email] || [];
      }
      
      function saveUserDevices(devices) {
          let lastLoggedInEmail = localStorage.getItem("lastLoggedInEmail");
          let allDevices = JSON.parse(localStorage.getItem("smartDevices")) || {};
          allDevices[lastLoggedInEmail] = devices;
          localStorage.setItem("smartDevices", JSON.stringify(allDevices));
      }
      
      
    });

    document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("deleteAllDevices").addEventListener("click", function () {
        if (confirm("Are you sure you want to delete all devices?")) {
            let lastLoggedInEmail = localStorage.getItem("lastLoggedInEmail");
            let allDevices = JSON.parse(localStorage.getItem("smartDevices")) || {};
            allDevices[lastLoggedInEmail] = []; // Clear only the current user's devices
            localStorage.setItem("smartDevices", JSON.stringify(allDevices));
            displayProducts([]); // Refresh UI
        }
    });
});


    document.addEventListener("DOMContentLoaded", function () {
      const container = document.getElementById("productsContainer");
  
      container.addEventListener("change", function (e) {
          if (e.target.classList.contains("toggle")) {
              let devices = JSON.parse(localStorage.getItem("smartDevices")) || [];
              let device = devices.find(d => d.id === parseInt(e.target.dataset.id));
  
              if (device) {
                  device.status = e.target.checked;
                  localStorage.setItem("smartDevices", JSON.stringify(devices));
              }
          }
      });
  });
  
  
    // Add a final "plus card" to create new products (depending on the userType)
    const plusCard = document.createElement('div');
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let lastLoggedInEmail = localStorage.getItem("lastLoggedInEmail") || null;
    let currentUser = users.find(user => user.email === lastLoggedInEmail);

    if (currentUser && currentUser.userType === "homeowner") {  
        plusCard.classList.add('add-card');
        plusCard.textContent = '+';
        plusCard.addEventListener('click', () => {
            window.location.href = 'Device-handling.html';
        });
        container.appendChild(plusCard);
    }
  }
  
  function filterProducts(category) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    if (category !== 'All') {
      products = products.filter(p => p.category === category);
    }
    displayProducts(products);
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Retrieve user details from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {


        
        if (user) {
            // Set the name in the profile section
            document.getElementById("profile-name").textContent = `Welcome back, ${user.firstname}!`;
        } else {
            document.getElementById("profile-name").textContent = "Welcome, Guest!";
        }
    } else {
        document.getElementById("profile-name").textContent = "Welcome, Guest!";
    }
});

document.addEventListener("DOMContentLoaded", function () {
  const automationList = document.getElementById("automation-list");
  const addAutomationBtn = document.getElementById("add-automation");

  let automations = JSON.parse(localStorage.getItem("automations")) || [];

  function renderAutomations() {
      automationList.innerHTML = ""; // Clear previous list
      automations.forEach((automation, index) => {
          const automationItem = document.createElement("div");
          automationItem.classList.add("automation-item");
          automationItem.innerHTML = `
              <span>${automation}</span>
              <button class="delete-automation" data-index="${index}">🗑 Delete</button>
          `;
          automationList.appendChild(automationItem);
      });

      // Add event listeners to delete buttons
      document.querySelectorAll(".delete-automation").forEach(button => {
          button.addEventListener("click", function () {
              const index = this.getAttribute("data-index");
              automations.splice(index, 1);
              localStorage.setItem("automations", JSON.stringify(automations));
              renderAutomations(); // Refresh UI
          });
      });
  }

  addAutomationBtn.addEventListener("click", function () {
      const routine = prompt("Enter your automation routine (e.g., Turn off lights at 10 PM)");
      if (routine) {
          automations.push(routine);
          localStorage.setItem("automations", JSON.stringify(automations));
          renderAutomations();
      }
  });

  renderAutomations(); // Initial load
});

function getBestEnergyTime() {
  // Simulated energy pricing data (replace this with real-time API later)
  const energyRates = [
      { time: "00:00", price: 0.30 },
      { time: "06:00", price: 0.25 },
      { time: "12:00", price: 0.40 },
      { time: "18:00", price: 0.60 },
      { time: "22:00", price: 0.20 }
  ];

  // Sort by cheapest price
  energyRates.sort((a, b) => a.price - b.price);

  const bestTime = energyRates[0]; // Get the lowest price time
  document.getElementById("best-time").innerText = `Best Time: ${bestTime.time} (Price: $${bestTime.price}/kWh)`;
}

// Load recommendation on page load
document.addEventListener("DOMContentLoaded", getBestEnergyTime);
