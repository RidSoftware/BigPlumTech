document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the last logged-in user's email
    const lastLoggedInEmail = localStorage.getItem("lastLoggedInEmail");

    // Retrieve all users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Find the currently logged-in user
    let currentUser = users.find(user => user.email === lastLoggedInEmail);

    if (currentUser) {
        // Set profile details
        document.getElementById("profile-name").textContent = currentUser.firstname + " " + currentUser.lastname;
        document.getElementById("profile-email").textContent = currentUser.email;

        // If a profile picture exists, update it
        if (currentUser.profilePic) {
            document.getElementById("profile-pic").src = currentUser.profilePic;
        }
    } else {
        console.warn("No user is currently logged in.");
        document.getElementById("profile-name").textContent = "Guest User";
        document.getElementById("profile-email").textContent = "Not Logged In";
    }

    // Add fade-in effect
    document.querySelectorAll(".fade-in").forEach(el => el.classList.add("visible"));
});
