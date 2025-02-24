document.addEventListener("DOMContentLoaded", function () {
    // Smooth Scroll Animation for Fading In
    const fadeInElements = document.querySelectorAll(".fade-in");

    function revealOnScroll() {
        const triggerBottom = window.innerHeight * 0.85; // Elements show when 85% in viewport

        fadeInElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                el.classList.add("visible"); // Triggers the fade-in animation
            }
        });
    }

    // Attach the event listener
    window.addEventListener("scroll", revealOnScroll);

    // Run function once on load to check if any elements are already in view
    revealOnScroll();
});
