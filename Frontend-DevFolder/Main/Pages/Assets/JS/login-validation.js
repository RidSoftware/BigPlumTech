document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let errorMessage = document.getElementById("loginErrorMessage"); // Make sure this exists in HTML

    if (!email.includes("@") || !email.includes(".")) {
        errorMessage.textContent = "Enter a valid email!";
        return;
    }

    if (password !== correctPassword) {
        errorMessage.textContent = "Wrong Password, Re-enter Password!";
        return;
    }
});

// Testing purposes, for comparing user data and set isloggedin to true
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let username = localStorage.getItem("username");

    if (!username) {
        alert("User not registered. Please register first.");
        return;
    }

    // Set login status
    localStorage.setItem("isLoggedIn", "true");

    alert("Login Successful! Welcome back, " + username);
    window.location.href = "index.html"; // Redirect to homepage
});


// Password Visibility Toggle for Login Page
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
