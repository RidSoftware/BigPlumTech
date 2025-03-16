import { loginUser } from './userAPI.js';
import * as energyAPI from './energyAPI.js';
import { syncDevicesFromBackend } from './deviceAPI.js';

document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let errorMessage = document.getElementById("loginErrorMessage"); 
    let confirmationMessage = document.getElementById("confirmationMessage");
    let overlay = document.getElementById("confirmationOverlay"); 
    
    //resets ui messages
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
    confirmationMessage.style.display = "none";
    overlay.style.display = "none"; 

    try {
         // Use the new loginUser API (which also updates localStorage with the user data)
         const user = await loginUser(email, password);
         if (!user) {
             errorMessage.textContent = "Login failed. Please try again.";
             errorMessage.style.display = "block";
             return;
         }
        let userID = user.userID;

        // Show confirmation message & overlay
        confirmationMessage.innerHTML = `
            <div class="confirmation-container">
                <h2>Login Successful!</h2>
                <p>Welcome back, <strong>${user.firstname}</strong></p>
                <button class="dashboard-btn" onclick="window.location.href='Dashboard.html'">
                    Go to Dashboard <i class="fa fa-arrow-right"></i>
                </button>
            </div>
        `;
        confirmationMessage.style.display = "block";
        overlay.style.display = "block"; // Show dark background overlay

        // These functions automatically update localStorage for energy data and devices.
        await energyAPI.syncEnergy24hr(userID);
        await energyAPI.syncEnergy7days(userID);
        await syncDevicesFromBackend(userID);
///////debuging logs
console.log(localStorage.getItem('energyDataDay'));
console.log(localStorage.getItem('energyDataWeek'));
console.log(localStorage.getItem('devices'));


    const debugDay  =   await energyAPI.pullDayEnergy(userID, "2025-03-16");
    const debugRange=   await energyAPI.pullDailyEnergyRange(userID, "2025-03-10", "2025-03-15");


///////////////errot for login
    } catch (error) {
        console.error("Login error:", error);
        errorMessage.textContent = "An error occurred. Please try again later.";
        errorMessage.style.display = "block";
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

