document.getElementById("registrationForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let fullname = document.getElementById("firstname").value;
    let lastname = document.getElementById("lastname").value;
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let userType = document.getElementById("userType").value;
    let terms = document.getElementById("terms").checked;
    let errorMessage = document.getElementById("errorMessage");

    if (firstname === "" || lastname === "" || email === "" || password === "" || confirmPassword === "" || userType === "") {
        errorMessage.textContent = "All fields are required!";
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        errorMessage.textContent = "Enter a valid email!";
        return;
    }

    if (password.length < 6) {
        errorMessage.textContent = "Password must be at least 6 characters!";
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match!";
        return;
    }

    if (!terms) {
        errorMessage.textContent = "You must agree to the Terms & Conditions!";
        return;
    }

    // If validation passes, store data and redirect
    localStorage.setItem("username", firstname + " " + lastname);
    localStorage.setItem("userType", userType);
    localStorage.setItem("isLoggedIn", "false"); // User registered but not logged in

    console.log("User Registered:", firstname + " " + lastname);
    console.log("User Type:", userType);

    // Redirect to confirmation page
    window.location.href = "/Pages/HTML/ConfirmationMessage.html";
});

// Admin Code Visibility & Generation
document.getElementById("userType").addEventListener("change", function() {
    const adminCodeField = document.getElementById("adminCodeField");
    const adminCodeInput = document.getElementById("adminCode");

    if (this.value === "homeManager") {
        adminCodeField.classList.remove("hidden");
        adminCodeInput.value = Math.floor(10000 + Math.random() * 90000); // Generate 5-digit code
    } else {
        adminCodeField.classList.add("hidden");
        adminCodeInput.value = "";
    }
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
