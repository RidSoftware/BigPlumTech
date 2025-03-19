import { contact } from './emailAPI.js';

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed.");
    const contactForm = document.getElementById("contactForm");

    if (!contactForm) {
        console.error("Contact form not found!");
        return;
    }

    console.log("Contact form found, adding event listener.");
    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault(); 
        console.log("Form submission event triggered.");

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        console.log("Form Data:", { name, email, message });

        if (!name || !email || !message) {
            alert("Please fill in all fields.");
            console.warn("Validation failed - missing fields.");
            return;
        }

        const formData = { name, email, message };

        try {
            console.log("Sending form data to contact API.", formData);
            const response = await contact(formData); // Calls emailAPI.js function
            console.log("API Response:", response);
            if (response) {
                alert(response.message);//////////////////////////////////////////
            } else {
                console.error("No response received from API.");
                alert("Unexpected error. Please try again.");
            }
        } catch (error) {
            console.error("Error while sending request:", error);
            alert("There was an error sending your message. Please try again later.");
        }
    });
});
