document.addEventListener("DOMContentLoaded", function () {
    function loadComponent(elementId, filePath) {
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.innerHTML = data;
                    if (elementId === "navbar") {
                        document.dispatchEvent(new Event("navbarLoaded")); // Dispatch event
                    }
                }
            })
            .catch(error => console.error(`Error loading ${filePath}:`, error));
    }

    loadComponent("navbar", "/Pages/HTML/Navbar.html");
    loadComponent("footer", "/Pages/HTML/Footer.html");

    function initializeSidebar() {
        const sidebar = document.getElementById("sidebar");
        const overlay = document.getElementById("overlay");
        const profileIcon = document.getElementById("profile-icon");
        const closeSidebar = document.getElementById("close-sidebar");
        const sidebarMenu = document.getElementById("sidebar-menu");
        const logoutModal = document.getElementById("logoutModal");
        const logoutConfirmation = document.getElementById("logout-confirmation");
        const confirmLogout = document.getElementById("confirmLogout");
        const cancelLogout = document.getElementById("cancelLogout");
        const overlayLogout = document.getElementById("overlay-logout");

        if (!sidebar || !profileIcon || !sidebarMenu) return;

        function updateSidebar() {
            let user = JSON.parse(localStorage.getItem("user")) || [];
            //let lastLoggedInEmail = localStorage.getItem("lastLoggedInEmail") || null;
            
            //let currentUser = user.getItem("Email");

            let profileSrc = localStorage.getItem("profilePic") || "";
        
            sidebarMenu.innerHTML = ""; // Clear previous content
        
            if (!user.Email) {
                sidebarMenu.innerHTML = `
                    <div class="sidebar-message">
                        <strong>Please Register First!</strong>
                        <p>To access personalized features, please register.</p>
                    </div>
                    <button class="sidebar-button" onclick="window.location.href='Registration.html'">Register Now</button>
                `;
            } else if (!user.isLoggedIn) {
                sidebarMenu.innerHTML = `
                    <div class="sidebar-message">
                        <strong>Log In Required</strong>
                        <p>You need to log in to access your dashboard.</p>
                    </div>
                    <button class="sidebar-button" onclick="window.location.href='Login.html'">Log In</button>
                `;
            } else {
                sidebarMenu.innerHTML = `
                    <div class="sidebar-user">
                        <h3>Welcome, ${user.firstname}</h3>

                        ${profileSrc.trim() !== "" 
                            ? `<img id="profile-img" src="${profileSrc}" alt="Profile Picture" class="profile-img" />` 
                            : `<i id="profile-icon" class="fa fa-user-circle" style="font-size: 90px;"></i>`}
                         
                        <div class="user-role">
                            <p>Role: ${user.userType === "homeManager" ? "Admin" : "User"}</p>
                        </div>
                        ${user.userType === "homeManager" ? `<p class="admin-code">Admin Code: <strong>WE DONT HAVE ADMIN COED</strong></p>` : ""}
                    </div>
        
                    <h4 class="sidebar-section-title">Main Menu</h4>
                    <hr>
                    <li><i class="fa fa-th-large"></i><a href="Dashboard.html"> Dashboard</a></li>
                    <li><i class="fa fa-bar-chart"></i><a href="Overview.html"> Overview</a></li>
                    <li><i class="fa fa-line-chart"></i><a href="Analytic.html"> Analytic</a></li>
        
                    <h4 class="sidebar-section-title">General</h4>
                    <hr>
                    <li><i class="fa fa-flag"></i><a href="Reports.html"> Reports</a></li>
                    <li><i class="fa fa-bell"></i><a href="Notifications.html"> Notifications</a></li>
        
                    ${user.userType === "homeManager" ? `
                        <h4 class="sidebar-section-title">Admin Controls</h4>
                        <hr>
                        <li><i class="fa fa-file-text"></i><a href="Generate-Report.html"> Generate Report</a></li>
                        <li><i class="fa fa-cogs"></i><a href="Device-handling.html"> Device Handling</a></li>
                        <li><i class="fa fa-microchip"></i><a href="Automation.html"> Device Automation </a></li>                    
                    ` : ''}
        
                    <h4 class="sidebar-section-title">Account</h4>
                    <hr>
                    <li><i class="fa fa-user"></i><a href="Profile.html"> Profile</a></li>
                    <li><i class="fa fa-cog"></i><a href="Settings.html"> Settings</a></li>
                    <button id="logout-btn"><i class="fa fa-sign-out"></i> Log Out</button>
                `;
        
                // Add event listener to Logout Button
                document.getElementById("logout-btn").addEventListener("click", function () {
                    // Show logout confirmation modal
                    logoutModal.style.display = "block";
                    overlayLogout.style.display = "block";
                });

                // If user confirms logout
                confirmLogout.addEventListener("click", function () {
                    user.isLoggedIn = false;
                    localStorage.removeItem("user");

                    // Hide logout confirmation modal and show thank you message
                    logoutModal.style.display = "none";
                    logoutConfirmation.innerHTML = `
                        <div class="confirmation-container">
                            <h2>Thank you for using our service!</h2>
                            <p>See you soon, ${user.firstname}</p>
                            <button class="continue-btn" onclick="window.location.href='index.html'">
                                Continue <i class="fa fa-arrow-right"></i>
                            </button>
                        </div>
                    `;
                    logoutConfirmation.style.display = "block";
                });

                // If user cancels logout
                cancelLogout.addEventListener("click", function () {
                    logoutModal.style.display = "none";
                    overlayLogout.style.display = "none"; // Hide overlay
                });
            }
        }

        overlay.style.display = "block"; // Show overlay after

        profileIcon.addEventListener("click", function () {
            updateSidebar();
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

    document.addEventListener("navbarLoaded", function () {
        const navLinks = document.getElementById("nav-links");
        const registerBtn = document.getElementById("register-btn");
        const loginBtn = document.getElementById("login-btn");
    
        if (!navLinks) {
            console.error("ERROR: 'nav-links' element not found!");
            return;
        }
    
        let user = JSON.parse(localStorage.getItem("user")) || [];
           
        console.log("Current User:", user);
    
        if (user.isLoggedIn) {
            console.log("👤 User logged in:", user.firstname);
    
            // Hide Register & Login Buttons
            if (registerBtn) registerBtn.style.display = "none";
            if (loginBtn) loginBtn.style.display = "none";
    
            // Update Navbar Links for Logged-in Users
            navLinks.innerHTML = `
                <li><a href="Dashboard.html"><i class="fa fa-th-large"></i> Dashboard</a></li>
                <li><a href="Overview.html"><i class="fa fa-bar-chart"></i> Overview</a></li>
                <li><a href="Analytic.html"><i class="fa fa-line-chart"></i> Analytic</a></li>
                ${user.userType === "homeManager" ? 
                    `<li><a href="Device-handling.html"><i class="fa fa-cogs"></i> Device Handling</a></li>
                    <li><i class="fa fa-microchip"></i><a href="Automation.html"> Device Automation </a></li>         ` 
                    : ''
                }
            `;
        } else {
            console.log("No user logged in. Keeping default navbar.");
    
            // Show Register & Login Buttons
            if (registerBtn) registerBtn.style.display = "inline-block";
            if (loginBtn) loginBtn.style.display = "inline-block";
    
            // Default Navbar Links
            navLinks.innerHTML = `
                <li><a href="index.html"><i class="fa fa-home"></i> Home</a></li>
                <li><a href="About.html"><i class="fa fa-info-circle"></i> About</a></li>
                <li><a href="Contact.html"><i class="fa fa-phone"></i> Contact</a></li>
            `;
        }
    
        initializeSidebar();
    });

document.addEventListener("DOMContentLoaded", function () {
    // Select the logo anchor tag
    const logo = document.getElementById("logo-id"); 
    const user = JSON.parse(localStorage.getItem("user")) || {}; 

    console.log("User Data:", user); // Debugging check

    // Ensure the logo element exists
    if (logo) {
        if (user.isLoggedIn) {
            console.log("User is logged in, setting href to Dashboard.html");
            logo.href = "Dashboard.html";
        } else {
            console.log("User is not logged in, setting href to index.html");
            logo.href = "index.html";
        }

        console.log("Updated Logo Href:", logo.href); // Debugging check
    } else {
        console.error("Logo element not found!");
    }
});

    
    
});
