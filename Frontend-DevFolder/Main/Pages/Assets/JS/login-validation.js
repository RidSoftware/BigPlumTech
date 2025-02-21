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
