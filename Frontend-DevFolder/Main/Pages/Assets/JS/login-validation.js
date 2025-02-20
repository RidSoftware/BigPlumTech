document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let errorMessage = document.getElementById("loginErrorMessage"); // Make sure this exists in HTML

    if (!email.includes("@") || !email.includes(".")) {
        errorMessage.textContent = "Enter a valid email!";
        return;
    }
    
    // Simulated correct password (Replace this with a real authentication system)
    let correctPassword = "123456"; // Temporary password for testing

    if (password !== correctPassword) {
        errorMessage.textContent = "Wrong Password, Re-enter Password!";
        return;
    }

    alert("Login Successful!");
    document.getElementById("loginForm").reset();
    errorMessage.textContent = "";
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
