document.addEventListener("DOMContentLoaded", function () {
    // Function to load a component
    function loadComponent(elementId, filePath) {
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
                document.getElementById(elementId).innerHTML = data;
            })
            .catch(error => console.error(`Error loading ${filePath}:`, error));
    }

    // Load Navbar
    loadComponent("navbar", "Navbar.html");

    // Load Footer
    loadComponent("footer", "Footer.html");
});
