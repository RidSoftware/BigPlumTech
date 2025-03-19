// Import the updateUser function from userAPI.js
import { updateUser } from "./userAPI.js";

document.addEventListener("DOMContentLoaded", async function () {
  // Get user data from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

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

  // Ensure proper data pre-filling
  firstnameInput.value = storedUser.firstname || "";
  lastnameInput.value = storedUser.Surname || "";
  emailInput.value = storedUser.Email || "";

  // Handle form submission to update user settings
  document.getElementById("settingsForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Create updated user object
    const updatedUser = {
      userID: storedUser.userID, // Ensure userID is included
      firstname: firstnameInput.value.trim(),
      surname: lastnameInput.value.trim(),
      email: emailInput.value.trim()
    };

    try {
      // Call the updateUser API
      const result = await updateUser(updatedUser);

      if (result && result.success) {
        // Update localStorage
        localStorage.setItem("user", JSON.stringify({...storedUser, ...updatedUser }));

        // Show success confirmation message
        showConfirmation("Changes Applied!", "Your profile has been successfully updated.", true);
      } else {
        // Show error message
        showConfirmation("Update Failed", result?.message || "An error occurred while updating your profile.", false);
      }

    } catch (error) {
      console.error("Error updating user settings:", error);
      showConfirmation("Update Failed", "There was an error connecting to the server. Please try again later.", false);
    }
  });

  // Function to show confirmation message
  function showConfirmation(title, message, isSuccess) {
    confirmationMessage.innerHTML = `
      <div class="confirmation-container">
        <h2>${title}</h2>
        <p>${message}</p>
        <button class="continue-btn" id="closeConfirmation">
          ${isSuccess ? "Continue" : "Try Again"} <i class="fa ${isSuccess ? "fa-arrow-right" : "fa-refresh"}"></i>
        </button>
      </div>
    `;

    // Show the overlay
    confirmationMessage.style.display = "block";
    overlay.style.display = "block";

    // Handle close action
    document.getElementById("closeConfirmation").addEventListener("click", () => {
      overlay.style.display = "none";
      confirmationMessage.style.display = "none";

      if (isSuccess) {
        window.location.reload(); // Refresh after success
      }
    });
  }
});
