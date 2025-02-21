// Preset categories
const categories = ['All', 'Living Room', 'Kitchen', 'Bedroom'];

// Example of an initial product list to see how filtering works immediately
let products = [
  { name: 'Living Room Lamp', category: 'Living Room', type: 'Light' },
  { name: 'Kitchen Light', category: 'Kitchen', type: 'Light' },
  { name: 'Bedroom AC', category: 'Bedroom', type: 'Air Conditioning' },
];

// Once the page loads, set everything up
document.addEventListener('DOMContentLoaded', () => {
  // Build category navigation
  const categoryList = document.getElementById('categoryList');
  categories.forEach(category => {
    const li = document.createElement('li');
    li.textContent = category;
    // When category is clicked, filter products
    li.addEventListener('click', () => filterProducts(category));
    categoryList.appendChild(li);
  });

  // Show all products at first
  displayProducts(products);

  // Handle "Add Product" form submission
  const form = document.getElementById('addProductForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addProduct();
  });
});

// Adds a product to our `products` array and refreshes the display
function addProduct() {
  const nameInput = document.getElementById('productName');
  const categorySelect = document.getElementById('productCategory');
  const typeSelect = document.getElementById('productType');

  // Create a new product object
  const newProduct = {
    name: nameInput.value,
    category: categorySelect.value,
    type: typeSelect.value
  };

  // Push it to our products array
  products.push(newProduct);

  // Reset the form
  nameInput.value = '';
  categorySelect.value = 'Living Room';
  typeSelect.value = 'Light';

  // Display all products (or display the category you just added to)
  displayProducts(products);
}

// Displays the given list of products in the #productsContainer
function displayProducts(productList) {
  const container = document.getElementById('productsContainer');
  container.innerHTML = ''; // Clear previous display

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

// Filters products based on the chosen category
function filterProducts(category) {
  if (category === 'All') {
    displayProducts(products);
  } else {
    const filtered = products.filter(p => p.category === category);
    displayProducts(filtered);
  }
}
