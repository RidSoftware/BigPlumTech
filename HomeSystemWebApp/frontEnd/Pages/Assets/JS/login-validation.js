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
        let response = await fetch("http://localhost:8080/api/login", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        let data = await response.json();

        if (!data.success) {
            errorMessage.textContent = data.message;
            errorMessage.style.display = "block";
            return;
        }

        //stores data locally
        localStorage.setItem("user", JSON.stringify(data.user));
        let user = JSON.parse(localStorage.getItem("user"));
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
/////////////////////
        // Attempt to pull 24-hour energy data
        try {
            let energyDayResponse = await fetch("http://localhost:8080/api/pull24hr", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userID })
            });

            if (energyDayResponse.ok) {
                let energyDataDay = await energyDayResponse.json();
                if (energyDataDay.success) {
                    localStorage.setItem("energyDataDay", JSON.stringify(energyDataDay.twentyfourhr));
                } else {
                    console.walogrn("24-hour energy data pull failed:", energyDataDay.message);
                    localStorage.setItem("energyDataDay", JSON.stringify({})); // store empty object if empty results
                }
            } else {
                throw new Error("Failed to fetch 24-hour energy data.");
            }
        } catch (error) {// error for 24hr
            console.log("Error fetching 24-hour energy data:", error);
            localStorage.setItem("energyDataDay", JSON.stringify({})); //Store empty object if errror
        }

//////////////////
        // Attempt to pull 7-day energy data
        try {
            let energyWeekResponse = await fetch("http://localhost:8080/api/pull7days", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userID })
            });

            if (energyWeekResponse.ok) {
                let energyDataWeek = await energyWeekResponse.json();
                if (energyDataWeek.success) {
                    localStorage.setItem("energyDataWeek", JSON.stringify(energyDataWeek.sevenDays));
                } else {
                    console.log("7-day energy data pull failed:", energyDataWeek.message);
                    localStorage.setItem("energyDataWeek", JSON.stringify({})); // store empty object if empty results
                }
            } else {
                throw new Error("Failed to fetch 7-day energy data.");
            }
        } catch (error) {/////error for 7days
            console.log("Error fetching 7-day energy data:", error);
            localStorage.setItem("energyDataWeek", JSON.stringify({})); //empty object if naothing
        }
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

