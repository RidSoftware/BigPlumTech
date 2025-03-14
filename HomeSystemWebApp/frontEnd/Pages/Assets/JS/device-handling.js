
const db = require("../../../../src/config/DBConnection.js");


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
  
  function valid(device){
		const blacklist = ["'", '"', "\\0", "\\n", "\\r", "\\", "\\Z", "--", ";", "/*", "\\*", "(", ")", "=", "|", "%", "_"]; //list of common escape characters, a slash has been added before each so the second slashes can be recognised 
		//var device = document.getElementById("deviceName").value;
    
    
		for(let i = 0; i < blacklist.length; i++){
		//looping through each member of list, if any match then we reject it.
		
		if(device.value.includes(blacklist[i])){
			//document.getElementById("accepted").innerHTML = "Not Valid"
      
			return 0;

		}
	}		//in later build this would also include the actual data being sent to database, but here is just pure example input validation for database
			//document.getElementById("accepted").innerHTML = "accepted"
      
      return 1;
	}

  function addProduct() {
    const deviceName = document.getElementById('deviceName');
    if(valid(deviceName) == 1){
      


    const categorySelect = document.getElementById('productCategory');
    const typeSelect = document.getElementById('productType');
    const newProduct = {
      name: deviceName.value,
      category: categorySelect.value,
      type: typeSelect.value
      };
  
    // Retrieve existing products from localStorage, add the new product, and save it
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    }else{
      
      deviceName.style.outline = "3px solid red";
      const err = document.getElementById("errMsg");
      err.style.fontSize = "14px"
      err.style.color = "red";
      err.innerHTML = "<p> Invalid Name </p>";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Add Product Button - Redirect after form submission
    

    const deviceName = document.getElementById('deviceName');
    
    
    const messageConfirmation = document.getElementById("confirmationMessage");
    const overlay = document.getElementById("confirmationOverlay"); 

    messageConfirmation.style.display = "none";
    overlay.style.display = "none";

    document.getElementById("addProductForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevents the default form submission

        if(valid(deviceName) == 1){
          
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
    }
    });
});

  