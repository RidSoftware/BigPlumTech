document.addEventListener('DOMContentLoaded', () => {
    // Handle form submission to add product
    const form = document.getElementById('addProductForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      addProduct();
    });
  
    // Handle the Return button to go back to the dashboard
    document.getElementById('returnButton').addEventListener('click', () => {
      window.location.href = 'Dashboard.html';
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

  }

  document.addEventListener("DOMContentLoaded", function () {
    // Add Product Button - Redirect after form submission

    const messageConfirmation = document.getElementById("confirmationMessage");
    const overlay = document.getElementById("confirmationOverlay"); 

    messageConfirmation.style.display = "none";
    overlay.style.display = "none";

    document.getElementById("addProductForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevents the default form submission

        messageConfirmation.innerHTML = `
            <div class="confirmation-container">
              <h2>Product Added!</h2>
              <p>Product has been updated in dashboard! Please go to dashboard.</strong></p>
              <button class="dashboard-btn" onclick="window.location.href='Dashboard.html'">
                  Go to Dashboard <i class="fa fa-arrow-right"></i>
              </button>
          </div>
        `;

        messageConfirmation.style.display = "block";
        overlay.style.display = "block"; // Show dark background overlay  
        // Redirect to dashboard
    });
});

  