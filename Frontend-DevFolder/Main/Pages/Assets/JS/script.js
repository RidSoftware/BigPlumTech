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
  
    // ===== Initialize Chart.js for Energy Usage =====
    const ctx = document.getElementById('myChart').getContext('2d');
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
      // Check if it's AC or not
      let card;
      if (product.type === 'Air Conditioning') {
        // Create the bigger AC card
        card = document.createElement('div');
        card.classList.add('ac-card');
  
        // Build the top row: text + toggle
        const topRow = document.createElement('div');
        topRow.classList.add('top-row');
  
        // Left side text
        const textSection = document.createElement('div');
        textSection.classList.add('text-section');
        textSection.innerHTML = `
          <h3>${product.name}</h3>
          <p>${product.category}</p>
        `;
        topRow.appendChild(textSection);
  
        // Toggle
        const toggleLabel = document.createElement('label');
        toggleLabel.classList.add('switch');
        toggleLabel.innerHTML = `
          <input type="checkbox" class="toggle">
          <span class="slider round"></span>
        `;
        topRow.appendChild(toggleLabel);
  
        card.appendChild(topRow);
  
        // AC slider at the bottom
        const sliderContainer = document.createElement('div');
        sliderContainer.classList.add('ac-slider-container');
        sliderContainer.innerHTML = `
          <div class="ac-slider-labels">
            <span>14°</span>
            <span>18°</span>
            <span>22°</span>
            <span>26°</span>
            <span>30°</span>
          </div>
          <input 
            type="range" 
            min="14" 
            max="30" 
            step="4" 
            value="22" 
            class="temperature-slider"
          />
        `;
        card.appendChild(sliderContainer);
  
      } else {
        // Create the default oval card
        card = document.createElement('div');
        card.classList.add('productCard');
        card.innerHTML = `
          <div>
            <h3>${product.name}</h3>
            <p>${product.category}</p>
          </div>
          <label class="switch">
            <input type="checkbox" class="toggle">
            <span class="slider round"></span>
          </label>
        `;
      }
  
      container.appendChild(card);
    });
  
    // Add a final "plus card" to create new products
    const plusCard = document.createElement('div');
    plusCard.classList.add('add-card');
    plusCard.textContent = '+';
    plusCard.addEventListener('click', () => {
      window.location.href = 'addProduct.html';
    });
    container.appendChild(plusCard);
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
    const storedUser = JSON.parse(localStorage.getItem("users"));

    if (storedUser) {
        // Assuming `lastRegisteredEmail` or `currentLoggedInEmail` is stored to identify the logged-in user
        const currentEmail = localStorage.getItem("lastRegisteredEmail") || localStorage.getItem("currentLoggedInEmail");
        
        // Find the user object matching the current email
        const currentUser = storedUser.find(user => user.email === currentEmail);
        
        if (currentUser) {
            // Set the name in the profile section
            document.getElementById("profile-name").textContent = `Welcome back, ${currentUser.firstname}!`;
        } else {
            document.getElementById("profile-name").textContent = "Welcome, Guest!";
        }
    } else {
        document.getElementById("profile-name").textContent = "Welcome, Guest!";
    }
});
