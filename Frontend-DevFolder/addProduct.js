document.addEventListener('DOMContentLoaded', () => {
    // Handle form submission to add product
    const form = document.getElementById('addProductForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      addProduct();
    });
  
    // Handle the Return button to go back to the dashboard
    document.getElementById('returnButton').addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  });
  
  function addProduct() {
    const categorySelect = document.getElementById('productCategory');
    const typeSelect = document.getElementById('productType');
    const newProduct = {
      name: typeSelect.value,
      category: categorySelect.value,
      type: typeSelect.value
    };
  
    // Retrieve existing products from localStorage, add the new product, and save it
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
  
    // Redirect back to the dashboard
    window.location.href = 'index.html';
  }
  