document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the last logged-in user's email from localStorage
    const lastLoggedInEmail = localStorage.getItem("lastLoggedInEmail");
  
    // Retrieve all users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];
  
    // Find the currently logged-in user by matching email
    let currentUser = users.find(user => user.email === lastLoggedInEmail);
  
    if (currentUser) {
      // Set profile details using user data
      document.getElementById("profile-name").textContent = currentUser.firstname + " " + currentUser.lastname;
      document.getElementById("profile-email").textContent = currentUser.email;
  
      // Update profile picture if available
      if (currentUser.profilePic) {
        document.getElementById("profile-pic").src = currentUser.profilePic;
      }
    } else {
      console.warn("No user is currently logged in.");
      document.getElementById("profile-name").textContent = "Guest User";
      document.getElementById("profile-email").textContent = "Not Logged In";
    }
  
    // Trigger the fade-in effect for the profile container
    document.querySelectorAll(".fade-in").forEach(el => el.classList.add("visible"));
  });
  