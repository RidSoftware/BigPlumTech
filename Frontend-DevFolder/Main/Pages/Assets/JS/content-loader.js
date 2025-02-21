document.addEventListener("DOMContentLoaded", function () {
    // Function to load a component only if the element exists on the page
    function loadComponent(elementId, filePath) {
        const element = document.getElementById(elementId);
        if (element) { // Only load if the div exists in the HTML
            fetch(filePath)
                .then(response => response.text())
                .then(data => {
                    element.innerHTML = data;
                })
                .catch(error => console.error(`Error loading ${filePath}:`, error));
        }
    }

    // Load Navbar only if the page contains a div with id="navbar"
    loadComponent("navbar", "Navbar.html");

    // Load Footer (Always loads because every page includes a div with id="footer")
    loadComponent("footer", "Footer.html");
});
