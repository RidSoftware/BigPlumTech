document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the last logged-in user's email
    const lastLoggedInEmail = localStorage.getItem("lastLoggedInEmail");

    // Retrieve all users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Find the currently logged-in user
    let currentUser = users.find(user => user.email === lastLoggedInEmail);

    const profilePic = document.getElementById("profile-pic");
    const profileIcon = document.getElementById("profile-icon");

    if (currentUser) {
        // Set profile details
        document.getElementById("profile-name").textContent = currentUser.firstname + " " + currentUser.lastname;
        document.getElementById("profile-email").textContent = currentUser.email;

        // Ensure profilePic exists and is not empty/null
        if (currentUser.profilePic && currentUser.profilePic.trim() !== "") {
            profilePic.src = currentUser.profilePic;
            profilePic.classList.remove("hidden");
        } else {
            profilePic.classList.add("hidden");
            profileIcon.classList.remove("hidden"); // Show FontAwesome icon
        }
    } else {
        console.warn("No user is currently logged in.");
        document.getElementById("profile-name").textContent = "Guest User";
        document.getElementById("profile-email").textContent = "Not Logged In";
        profilePic.classList.add("hidden");
        profileIcon.classList.remove("hidden"); // Ensure icon is visible for guest users
    }

    // Add fade-in effect
    document.querySelectorAll(".fade-in").forEach(el => el.classList.add("visible"));
});
