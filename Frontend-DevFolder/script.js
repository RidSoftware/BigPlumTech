document.addEventListener('DOMContentLoaded', () => {
  // Navigate to addProduct.html when the button is clicked
  document.getElementById('addProductButton').addEventListener('click', () => {
    window.location.href = 'addProduct.html';
  });

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

  displayProducts(products);
});

function displayProducts(productList) {
  const container = document.getElementById('productsContainer');
  container.innerHTML = '';
  productList.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('productCard');
    // Updated product card markup with iOS slider toggle for on/off functionality
    card.innerHTML = `
      <h3>${product.name}</h3>
      <p>Category: ${product.category}</p>
      <label class="switch">
        <input type="checkbox" class="toggle">
        <span class="slider round"></span>
      </label>
    `;
    container.appendChild(card);
  });
}

function filterProducts(category) {
  let products = JSON.parse(localStorage.getItem('products')) || [];
  if (category !== 'All') {
    products = products.filter(p => p.category === category);
  }
  displayProducts(products);
}
