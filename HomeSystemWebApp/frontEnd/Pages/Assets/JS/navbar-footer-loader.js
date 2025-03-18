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
            
            // Get current page for highlight
            const currentPage = window.location.pathname.split("/").pop() || "index.html";
        
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
                    </div>
        
                    <h4 class="sidebar-section-title">Main Menu</h4>
                    <hr>
                    <li class="${currentPage === 'Dashboard.html' ? 'active' : ''}"><i class="fa fa-th-large"></i><a href="Dashboard.html" class="${currentPage === 'Dashboard.html' ? 'active' : ''}"> Dashboard</a></li>
                    <li class="${currentPage === 'Overview.html' ? 'active' : ''}"><i class="fa fa-bar-chart"></i><a href="Overview.html" class="${currentPage === 'Overview.html' ? 'active' : ''}"> Overview</a></li>
                    <li class="${currentPage === 'Analytic.html' ? 'active' : ''}"><i class="fa fa-line-chart"></i><a href="Analytic.html" class="${currentPage === 'Analytic.html' ? 'active' : ''}"> Analytic</a></li>
        
                    <h4 class="sidebar-section-title">General</h4>
                    <hr>
                    <li class="${currentPage === 'CriticalReports.html' ? 'active' : ''}"><i class="fa fa-flag"></i><a href="CriticalReports.html" class="${currentPage === 'CriticalReports.html' ? 'active' : ''}"> Critical Reports</a></li>
                    <li class="${currentPage === 'Notifications.html' ? 'active' : ''}"><i class="fa fa-bell"></i><a href="Notifications.html" class="${currentPage === 'Notifications.html' ? 'active' : ''}"> Notifications</a></li>
        
                    ${user.userType === "homeManager" ? `
                        <h4 class="sidebar-section-title">Admin Controls</h4>
                        <hr>
                        <li class="${currentPage === 'Generate-Report.html' ? 'active' : ''}"><i class="fa fa-file-text"></i><a href="Generate-Report.html" class="${currentPage === 'Generate-Report.html' ? 'active' : ''}"> Generate Report</a></li>
                        <li class="${currentPage === 'Device-handling.html' ? 'active' : ''}"><i class="fa fa-cogs"></i><a href="Device-handling.html" class="${currentPage === 'Device-handling.html' ? 'active' : ''}"> Device Handling</a></li>
                        <li class="${currentPage === 'Automation.html' ? 'active' : ''}"><i class="fa fa-microchip"></i><a href="Automation.html" class="${currentPage === 'Automation.html' ? 'active' : ''}"> Device Automation </a></li>                    
                    ` : ''}
        
                    <h4 class="sidebar-section-title">Account</h4>
                    <hr>
                    <li class="${currentPage === 'Profile.html' ? 'active' : ''}"><i class="fa fa-user"></i><a href="Profile.html" class="${currentPage === 'Profile.html' ? 'active' : ''}"> Profile</a></li>
                    <li class="${currentPage === 'Settings.html' ? 'active' : ''}"><i class="fa fa-cog"></i><a href="Settings.html" class="${currentPage === 'Settings.html' ? 'active' : ''}"> Settings</a></li>
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
        const mobileNavLinks = document.getElementById("mobile-nav-links");
        const registerBtn = document.getElementById("register-btn");
        const loginBtn = document.getElementById("login-btn");
        const mobileRegisterBtn = document.getElementById("mobile-register-btn");
        const mobileLoginBtn = document.getElementById("mobile-login-btn");
        const hamburgerMenu = document.getElementById("hamburger-menu");
        const mobileNavContainer = document.getElementById("mobile-nav-container");
        const mobileCloseBtn = document.getElementById("mobile-close-btn");
    
        if (!navLinks) {
            console.error("ERROR: 'nav-links' element not found!");
            return;
        }
    
        let user = JSON.parse(localStorage.getItem("user")) || [];
        
        // Get current page for highlight
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
           
        console.log("Current User:", user);
        console.log("Current Page:", currentPage);
    
        if (user.isLoggedIn) {
            console.log("👤 User logged in:", user.firstname);
    
            // Hide Register & Login Buttons
            if (registerBtn) registerBtn.style.display = "none";
            if (loginBtn) loginBtn.style.display = "none";
            if (mobileRegisterBtn) mobileRegisterBtn.style.display = "none";
            if (mobileLoginBtn) mobileLoginBtn.style.display = "none";
    
            // Update Navbar Links for Logged-in Users
            const navContent = `
                <li><a href="Dashboard.html" class="${currentPage === 'Dashboard.html' ? 'active' : ''}"><i class="fa fa-th-large"></i> Dashboard</a></li>
                <li><a href="Overview.html" class="${currentPage === 'Overview.html' ? 'active' : ''}"><i class="fa fa-bar-chart"></i> Overview</a></li>
                <li><a href="Analytic.html" class="${currentPage === 'Analytic.html' ? 'active' : ''}"><i class="fa fa-line-chart"></i> Analytic</a></li>
                ${user.userType === "homeManager" ? 
                    `<li><a href="Device-handling.html" class="${currentPage === 'Device-handling.html' ? 'active' : ''}"><i class="fa fa-cogs"></i> Device Handling</a></li>
                    <li><a href="Automation.html" class="${currentPage === 'Automation.html' ? 'active' : ''}"><i class="fa fa-microchip"></i> Device Automation</a></li>` 
                    : ''
                }
            `;
            
            navLinks.innerHTML = navContent;
            if (mobileNavLinks) mobileNavLinks.innerHTML = navContent;
        } else {
            console.log("No user logged in. Keeping default navbar.");
    
            // Show Register & Login Buttons
            if (registerBtn) registerBtn.style.display = "inline-block";
            if (loginBtn) loginBtn.style.display = "inline-block";
            if (mobileRegisterBtn) mobileRegisterBtn.style.display = "inline-block";
            if (mobileLoginBtn) mobileLoginBtn.style.display = "inline-block";
    
            // Default Navbar Links
            const navContent = `
                <li><a href="index.html" class="${currentPage === 'index.html' ? 'active' : ''}"><i class="fa fa-home"></i> Home</a></li>
                <li><a href="About.html" class="${currentPage === 'About.html' ? 'active' : ''}"><i class="fa fa-info-circle"></i> About</a></li>
                <li><a href="Contact.html" class="${currentPage === 'Contact.html' ? 'active' : ''}"><i class="fa fa-phone"></i> Contact</a></li>
            `;
            
            navLinks.innerHTML = navContent;
            if (mobileNavLinks) mobileNavLinks.innerHTML = navContent;
        }
        
        // Hamburger menu functionality
        if (hamburgerMenu) {
            hamburgerMenu.addEventListener("click", function() {
                hamburgerMenu.classList.toggle("active");
                mobileNavContainer.classList.toggle("active");
            });
        }
        
        // Mobile menu close button
        if (mobileCloseBtn) {
            mobileCloseBtn.addEventListener("click", function() {
                hamburgerMenu.classList.remove("active");
                mobileNavContainer.classList.remove("active");
            });
        }
    
        initializeSidebar();
    });

// Function to handle logo redirection
document.addEventListener("navbarLoaded", function () {
    // Select the logo elements
    const mainLogo = document.querySelector(".logo");
    const mobileLogo = document.querySelector(".mobile-logo");
    
    // Add click event listeners to redirect to homepage or dashboard based on login status
    if (mainLogo) {
        mainLogo.addEventListener("click", function() {
            const user = JSON.parse(localStorage.getItem("user")) || [];
            if (user.isLoggedIn) {
                window.location.href = "Dashboard.html";
            } else {
                window.location.href = "index.html";
            }
        });
    }
    
    if (mobileLogo) {
        mobileLogo.addEventListener("click", function() {
            const user = JSON.parse(localStorage.getItem("user")) || [];
            if (user.isLoggedIn) {
                window.location.href = "Dashboard.html";
            } else {
                window.location.href = "index.html";
            }
        });
    }
});

// End of DOMContentLoaded event listener
});