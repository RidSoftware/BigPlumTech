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

  // Display confirmation message
  let overlay = document.getElementById("confirmationOverlay");
  let confirmationMessage = document.getElementById("confirmationMessage");

  confirmationMessage.style.display = "none";
  overlay.style.display = "none";

  // If user is found, pre-fill the form
  if (users) {
      firstnameInput.value = users.firstname || "";
      lastnameInput.value = users.Surname || "";
      emailInput.value = users.Email || "";
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
  });
});

document.getElementById("logoutBtn").addEventListener("click", function () {
  localStorage.removeItem("lastLoggedInEmail"); // Clear session
  localStorage.removeItem("user"); // Remove user data
  window.location.href = "index.html"; // Redirect to homepage
});
