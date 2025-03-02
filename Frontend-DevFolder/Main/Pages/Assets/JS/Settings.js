document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the last logged-in user's email from localStorage
    const lastLoggedInEmail = localStorage.getItem("lastLoggedInEmail");
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Find the index of the currently logged-in user
    let currentUserIndex = users.findIndex(user => user.email === lastLoggedInEmail);
  
    // Get references to form inputs
    const firstnameInput = document.getElementById("firstname");
    const lastnameInput = document.getElementById("lastname");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const profilePicInput = document.getElementById("profilePic");
  
    // If a user is found, pre-fill the form with their details
    if (currentUserIndex !== -1) {
      const currentUser = users[currentUserIndex];
      firstnameInput.value = currentUser.firstname || "";
      lastnameInput.value = currentUser.lastname || "";
      emailInput.value = currentUser.email || "";
      profilePicInput.value = currentUser.profilePic || "";
    } else {
      alert("No user found. Please log in.");
    }
  
    // Handle form submission to update user settings
    document.getElementById("settingsForm").addEventListener("submit", function(event) {
      event.preventDefault();
      if (currentUserIndex !== -1) {
        // Update user details based on form values
        users[currentUserIndex].firstname = firstnameInput.value.trim();
        users[currentUserIndex].lastname = lastnameInput.value.trim();
        users[currentUserIndex].email = emailInput.value.trim();
        // Update password only if a new one is provided
        if (passwordInput.value.trim() !== "") {
          users[currentUserIndex].password = passwordInput.value;
        }
        users[currentUserIndex].profilePic = profilePicInput.value.trim();
  
        // Save the updated users array back to localStorage
        localStorage.setItem("users", JSON.stringify(users));
        // Update last logged-in email in case the email was changed
        localStorage.setItem("lastLoggedInEmail", users[currentUserIndex].email);
  
        
      }
    });
  });
  