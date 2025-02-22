document.addEventListener("DOMContentLoaded", function () {
    function loadComponent(elementId, filePath, callback) {
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.innerHTML = data;
                    if (callback) callback();
                }
            })
            .catch(error => console.error(`Error loading ${filePath}:`, error));
    }

    loadComponent("navbar", "/Pages/HTML/Navbar.html", initializeSidebar);
    loadComponent("footer", "/Pages/HTML/Footer.html");

    function initializeSidebar() {
        const navbar = document.getElementById("navbar");
        const sidebar = document.getElementById("sidebar");
        const overlay = document.getElementById("overlay");
        const profileIcon = document.getElementById("profile-icon");
        const closeSidebar = document.getElementById("close-sidebar");
        const sidebarMenu = document.getElementById("sidebar-menu"); 

        if (!sidebar || !profileIcon || !sidebarMenu) return;

        function updateSidebar() {
            // Refresh LocalStorage Data
            let users = JSON.parse(localStorage.getItem("users")) || [];
            let lastLoggedInEmail = localStorage.getItem("lastLoggedInEmail") || null;

            console.log("🔹 All Users:", users);
            console.log("🔹 Last Logged In Email:", lastLoggedInEmail);

            // Find the logged-in user
            let currentUser = users.find(user => user.email === lastLoggedInEmail);

            sidebarMenu.innerHTML = ""; // Clear previous content

            if (!currentUser) {
                sidebarMenu.innerHTML = `
                    <li><h3>Please Register First!</h3></li>
                    <li><button onclick="window.location.href='Registration.html'">Register Now</button></li>
                `;
            } else if (!currentUser.isLoggedIn) {
                sidebarMenu.innerHTML = `
                    <li><h3>Please Log In!</h3></li>
                    <li><button onclick="window.location.href='Login.html'">Login Now</button></li>
                `;
            } else {
                sidebarMenu.innerHTML = `
                    <li><h3>Welcome, ${currentUser.firstname}!</h3></li>
                    ${currentUser.userType === "homeManager" ? `
                        <li><button onclick="window.location.href='manage-users.html'">Manage Users</button></li>
                        <li><button onclick="window.location.href='view-reports.html'">View Reports</button></li>
                    ` : `
                        <li><button onclick="window.location.href='profile.html'">My Profile</button></li>
                    `}
                    <li><button id="logout-btn">Log Out</button></li>
                `;

                document.getElementById("logout-btn").addEventListener("click", function () {
                    currentUser.isLoggedIn = false;
                    localStorage.setItem("users", JSON.stringify(users)); // Update LocalStorage
                    localStorage.removeItem("lastLoggedInEmail");
                    alert("Logged out!");
                    window.location.reload();
                });
            }
        }

        profileIcon.addEventListener("click", function () {
            updateSidebar(); // Refresh user info
            sidebar.classList.add("show");
            overlay.style.opacity = "1";
            overlay.style.visibility = "visible";
        });

        closeSidebar.addEventListener("click", function () {
            sidebar.classList.remove("show");
            overlay.style.opacity = "0";
            overlay.style.visibility = "hidden";
        });

        overlay.addEventListener("click", function () {
            sidebar.classList.remove("show");
            overlay.style.opacity = "0";
            overlay.style.visibility = "hidden";
        });
    }
});
