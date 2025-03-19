document.addEventListener("DOMContentLoaded", function () {
    // Retrieve users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    
    // Get references to form inputs
    const firstnameInput = document.getElementById("firstname");
    const lastnameInput = document.getElementById("lastname");
    const emailInput = document.getElementById("email");
    
    // Get references to confirmation elements
    const overlay = document.getElementById("confirmationOverlay");
    const confirmationMessage = document.getElementById("confirmationMessage");
    
    // Hide confirmation elements initially
    confirmationMessage.style.display = "none";
    overlay.style.display = "none";
    
    // If user is found, pre-fill the form
    if (users) {
      firstnameInput.value = users.firstname || "";
      lastnameInput.value = users.Surname || ""; // Changed from Surname to lastname for consistency
      emailInput.value = users.Email || "";
    } 
    
    // Handle form submission to update user settings
    document.getElementById("settingsForm").addEventListener("submit", function (event) {
      event.preventDefault();
      
      // Update user details
      users.firstname = firstnameInput.value.trim();
      users.Surname = lastnameInput.value.trim(); 
      const newEmail = emailInput.value.trim();
      
      // Update email and the Email key in localStorage if changed
      if (users.Email !== newEmail) {
        users.Email = newEmail;
        localStorage.setItem("Email", newEmail);
      }
      
      // Update the users array in localStorage
      localStorage.setItem("users", JSON.stringify(users));
      
      // Show confirmation message
      confirmationMessage.innerHTML = `
        <div class="confirmation-container">
          <h2>Changes Applied!</h2>
          <p>Your profile has been successfully updated.</p>
          <button class="continue-btn" onclick="window.location.href='Dashboard.html'">
            Continue <i class="fa fa-arrow-right"></i>
          </button>
        </div>
      `;
      
      confirmationMessage.style.display = "block";
      overlay.style.display = "block";
    });
  });