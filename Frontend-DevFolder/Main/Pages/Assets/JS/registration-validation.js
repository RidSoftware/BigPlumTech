document.getElementById("registrationForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let firstname = document.getElementById("firstname").value.trim();
    let lastname = document.getElementById("lastname").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let userType = document.getElementById("userType").value;
    let terms = document.getElementById("terms").checked;
    let errorMessage = document.getElementById("errorMessage");

    errorMessage.textContent = "";
    errorMessage.style.display = "none";

    // Validation Checks
    if (firstname === "" || lastname === "" || email === "" || password === "" || confirmPassword === "" || userType === "") {
        errorMessage.textContent = "All fields are required!";
        errorMessage.style.display = "block";
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        errorMessage.textContent = "Enter a valid email!";
        errorMessage.style.display = "block";
        return;
    }

    if (password.length < 6) {
        errorMessage.textContent = "Password must be at least 6 characters!";
        errorMessage.style.display = "block";
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match!";
        errorMessage.style.display = "block";
        return;
    }

    if (!terms) {
        errorMessage.textContent = "You must agree to the Terms & Conditions!";
        errorMessage.style.display = "block";
        return;
    }

    // Generate Admin Code only for Home Managers
    let adminCode = "";
    if (userType === "homeManager") {
        adminCode = Math.floor(10000 + Math.random() * 90000).toString(); // Generate a 5-digit code
    }

    // Retrieve existing users from localStorage (Make sure it doesn't get overwritten)
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if the user already exists
    let existingUser = users.find(user => user.email === email);
    if (existingUser) {
        errorMessage.textContent = "This email is already registered!";
        errorMessage.style.display = "block";
        return;
    }

    // Create new user object
    let newUser = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        userType: userType,
        adminCode: adminCode,
        isLoggedIn: false
    };

    // Append new user to existing users array
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users)); // Now it won't overwrite existing data

    // Store the last registered email to identify the correct user in the confirmation page
    localStorage.setItem("lastRegisteredEmail", email);

    console.log("User Registered:", newUser);
    
    // Redirect to confirmation page
    window.location.href = "/Pages/HTML/ConfirmationMessage.html";
});

// Reset form on page load
window.onload = function() {
    document.getElementById("registrationForm").reset();
};

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
