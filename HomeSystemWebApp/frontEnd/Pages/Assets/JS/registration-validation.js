document.getElementById("registrationForm").addEventListener("submit", async function(event) {
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



    // creats user object
    let newUser = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        userType: userType,
        password: password,
    };


    try {
        // Send data to the backend
        const result = await registerUser(newUser);
        if (result && result.success) {
            // Clear form and redirect on success
            document.getElementById("registrationForm").reset();
            window.location.href = "/Pages/HTML/ConfirmationMessage.html";
        } else {
            errorMessage.textContent = result && result.message ? result.message : "Registration failed";
            errorMessage.style.display = "block";
        }  errorMessage.style.display = "block";
    } catch (error) {
        console.error("Error during registration:", error);
        errorMessage.textContent = "An error occurred during registration. Please try again.";
        errorMessage.style.display = "block";
    }

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
