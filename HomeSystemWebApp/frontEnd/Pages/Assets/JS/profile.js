document.addEventListener("DOMContentLoaded", function () {
    // Retrieve all users from localStorage
    let users = JSON.parse(localStorage.getItem("user")) || [];

    const profilePic = document.getElementById("profile-pic");
    const profileIcon = document.getElementById("profile-icon");

    if (users) {
        // Set profile details
        document.getElementById("profile-name").textContent = users.firstname + " " + users.Surname;
        document.getElementById("profile-email").textContent = users.Email;

        // Ensure profilePic exists and is not empty/null
        if (users.profilePic && user.profilePic.trim() !== "") {
            profilePic.src = users.profilePic;
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
