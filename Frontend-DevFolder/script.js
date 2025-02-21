// Preset categories
const categories = ['All', 'Living Room', 'Kitchen', 'Bedroom'];

// Initial products
let products = [
  { name: 'Light', category: 'Living Room', type: 'Light' },
  { name: 'Light', category: 'Kitchen', type: 'Light' },
  { name: 'Air Conditioning', category: 'Bedroom', type: 'Air Conditioning' },
];

document.addEventListener('DOMContentLoaded', () => {
  // Build category buttons
  const categoryNav = document.getElementById('categoryNav');
  categories.forEach(category => {
    const button = document.createElement('button');
    button.textContent = category;
    button.classList.add('category-button');
    // On click, filter the products
    button.addEventListener('click', () => filterProducts(category));
    categoryNav.appendChild(button);
  });

  // Display all products initially
  displayProducts(products);

  // Handle form submission
  const form = document.getElementById('addProductForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addProduct();
  });
});

// Adds a new product with auto-generated name (same as type)
function addProduct() {
  const categorySelect = document.getElementById('productCategory');
  const typeSelect = document.getElementById('productType');

  const newProduct = {
    name: typeSelect.value,
    category: categorySelect.value,
    type: typeSelect.value
  };

  products.push(newProduct);

  // Reset form to defaults
  categorySelect.value = 'Living Room';
  typeSelect.value = 'Light';

  // Display updated products
  displayProducts(products);
}

// Display the provided list of products
function displayProducts(productList) {
  const container = document.getElementById('productsContainer');
  container.innerHTML = ''; // Clear previous

  productList.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('productCard');
    card.innerHTML = `
      <h3>${product.name}</h3>
      <p>Category: ${product.category}</p>
      <p>Type: ${product.type}</p>
    `;
    container.appendChild(card);
  });
}

// Filter products by category
function filterProducts(category) {
  if (category === 'All') {
    displayProducts(products);
  } else {
    const filtered = products.filter(p => p.category === category);
    displayProducts(filtered);
  }
}
