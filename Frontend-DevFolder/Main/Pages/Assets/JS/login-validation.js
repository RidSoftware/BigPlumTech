document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let errorMessage = document.getElementById("loginErrorMessage"); 
    
    errorMessage.textContent = "";
    errorMessage.style.display = "none";

    // Retrieve the list of users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if the email exists in the stored users
    let currentUser = users.find(user => user.email === email);

    if (!currentUser) {
        errorMessage.textContent = "User not found. Please register first.";
        errorMessage.style.display = "block";
        return;
    }

    // Check if the password matches
    if (currentUser.password !== password) {
        errorMessage.textContent = "Wrong password! Please try again.";
        errorMessage.style.display = "block";
        return;
    }

    // Set login status in localStorage
    currentUser.isLoggedIn = true;

    // Update localStorage with new login status
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("lastLoggedInEmail", email);

    alert("Login Successful! Welcome back, " + currentUser.firstname);

    // Redirect to homepage
    window.location.href = "index.html";
});

// Password Visibility Toggle
document.getElementById("togglePassword").addEventListener("click", function() {
    const passwordField = document.getElementById("password");
    if (passwordField.type === "password") {
        passwordField.type = "text";
        this.classList.replace("fa-eye-slash", "fa-eye");
    } else {
        passwordField.type = "password";
        this.classList.replace("fa-eye", "fa-eye-slash");
    }
});

document.getElementById("forgotPasswordLink").addEventListener("click", function() {
    document.getElementById("forgotPasswordModal").style.display = "block";
});

document.getElementById("closeModal").addEventListener("click", function() {
    document.getElementById("forgotPasswordModal").style.display = "none";
});

document.getElementById("resetPasswordButton").addEventListener("click", function() {
    let resetEmail = document.getElementById("resetEmail").value.trim();
    let resetErrorMessage = document.getElementById("resetErrorMessage");

    // Reset previous errors
    resetErrorMessage.textContent = "";
    resetErrorMessage.style.display = "none";

    // Retrieve stored users from Local Storage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Find the user by email
    let user = users.find(user => user.email === resetEmail);

    if (!user) {
        resetErrorMessage.textContent = "Email not found!";
        resetErrorMessage.style.display = "block";
        return;
    }

    // Generate a new temporary password
    let tempPassword = Math.random().toString(36).slice(-8); // Random 8-character string
    user.password = tempPassword;

    // Save updated users back to Local Storage
    localStorage.setItem("users", JSON.stringify(users));

    alert("A temporary password has been generated: " + tempPassword + ". Please log in and change it.");

    // Close the modal
    document.getElementById("forgotPasswordModal").style.display = "none";
});

