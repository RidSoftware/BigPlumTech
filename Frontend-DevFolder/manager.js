document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
  });
  
  function loadProducts() {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    const tbody = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear existing rows
  
    products.forEach((product, index) => {
      const row = document.createElement('tr');
  
      // Name cell
      const nameCell = document.createElement('td');
      nameCell.textContent = product.name;
      row.appendChild(nameCell);
  
      // Category cell
      const categoryCell = document.createElement('td');
      categoryCell.textContent = product.category;
      row.appendChild(categoryCell);
  
      // Type cell
      const typeCell = document.createElement('td');
      typeCell.textContent = product.type;
      row.appendChild(typeCell);
  
      // Actions cell
      const actionsCell = document.createElement('td');
  
      // Edit button
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.classList.add('action-button', 'edit-button');
      editButton.addEventListener('click', () => editProduct(index));
      actionsCell.appendChild(editButton);
  
      // Delete button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('action-button', 'delete-button');
      deleteButton.addEventListener('click', () => deleteProduct(index));
      actionsCell.appendChild(deleteButton);
  
      row.appendChild(actionsCell);
      tbody.appendChild(row);
    });
  }
  
  function editProduct(index) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    const newName = prompt("Enter new product name:", products[index].name);
    if (newName !== null) {
      products[index].name = newName;
      localStorage.setItem('products', JSON.stringify(products));
      loadProducts();
    }
  }
  
  function deleteProduct(index) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    if (confirm("Are you sure you want to delete this product?")) {
      products.splice(index, 1);
      localStorage.setItem('products', JSON.stringify(products));
      loadProducts();
    }
  }
  