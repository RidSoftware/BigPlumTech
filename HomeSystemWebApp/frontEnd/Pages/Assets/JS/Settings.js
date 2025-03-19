document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Get user input
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  // Retrieve users from localStorage
  let users = JSON.parse(localStorage.getItem("user")) || [];

  // Check if user exists
  let user = users.find(user => user.Email === email && user.password === password);

  if (user) {
      // Store logged-in user's email
      localStorage.setItem("lastLoggedInEmail", email);
      localStorage.setItem("user", JSON.stringify(user)); // Store user session

      alert("Login successful!");
      window.location.href = "Dashboard.html"; // Redirect to dashboard
  } else {
      alert("Invalid email or password. Please try again.");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Retrieve users from localStorage
  let users = JSON.parse(localStorage.getItem("user")) || [];

  // Get references to form inputs
  const firstnameInput = document.getElementById("firstname");
  const lastnameInput = document.getElementById("lastname");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const profilePicInput = document.getElementById("profilePic");

  // Display confirmation message
  let overlay = document.getElementById("confirmationOverlay");
  let confirmationMessage = document.getElementById("confirmationMessage");

  confirmationMessage.style.display = "none";
  overlay.style.display = "none";

  // If user is found, pre-fill the form
  if (currentUser) {
      firstnameInput.value = currentUser.firstname || "";
      lastnameInput.value = currentUser.Surname || "";
      emailInput.value = currentUser.Email || "";
      profilePicInput.value = currentUser.profilePic || "";
  } else {
      alert("No user found. Please log in.");
      window.location.href = "login.html"; // Redirect user to login if no session found
      return;
  }

  // Handle form submission to update user settings
  document.getElementById("settingsForm").addEventListener("submit", function (event) {
      event.preventDefault();

      // Update user details
      currentUser.firstname = firstnameInput.value.trim();
      currentUser.Surname = lastnameInput.value.trim();
      currentUser.Email = emailInput.value.trim();

      // Update password only if a new one is provided
      if (passwordInput.value.trim() !== "") {
          currentUser.password = passwordInput.value;
      }

      // Update `lastLoggedInEmail` in case the email was changed
      localStorage.setItem("Email", currentUser.Email);

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

document.getElementById("logoutBtn").addEventListener("click", function () {
  localStorage.removeItem("lastLoggedInEmail"); // Clear session
  localStorage.removeItem("user"); // Remove user data
  window.location.href = "index.html"; // Redirect to homepage
});
