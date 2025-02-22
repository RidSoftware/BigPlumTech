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

  // Initially display all products
  displayProducts(products);
});

/**
 * Renders the product cards and a plus card at the end
 */
function displayProducts(productList) {
  const container = document.getElementById('productsContainer');
  container.innerHTML = '';

  // Render each product as a card
  productList.forEach(product => {
    const card = document.createElement('div');
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

/**
 * Filters the displayed products by category
 */
function filterProducts(category) {
  let products = JSON.parse(localStorage.getItem('products')) || [];
  if (category !== 'All') {
    products = products.filter(p => p.category === category);
  }
  displayProducts(products);
}
