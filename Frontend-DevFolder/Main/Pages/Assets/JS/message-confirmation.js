document.addEventListener("DOMContentLoaded", function () {
    // Retrieve stored users & last registered email
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let lastRegisteredEmail = localStorage.getItem("lastRegisteredEmail");

    if (!lastRegisteredEmail) {
        console.log("No registered user found.");
        return;
    }

    // Find the user who just registered
    let currentUser = users.find(user => user.email === lastRegisteredEmail);

    if (!currentUser) {
        console.log("No matching user found.");
        return;
    }

    console.log("Confirmation for:", currentUser);

    // Update UI for confirmation message
    document.querySelector(".message-container h2").textContent = `Thank you for registering, ${currentUser.firstname}!`;

    // Generate Admin Code only for Home Managers
    let adminCode = "";
    if (currentUser.userType === "homeManager") {
        adminCode = Math.floor(10000 + Math.random() * 90000).toString(); // Generate a 5-digit code
    }

    // If the user is a Home Manager, show the Admin Code
    if (currentUser.userType === "homeManager" && currentUser.adminCode) {
        document.getElementById("admin-code-section").style.display = "block";
        document.getElementById("adminCode").textContent = currentUser.adminCode;
    }
});
