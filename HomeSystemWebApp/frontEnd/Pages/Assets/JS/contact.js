import { contact } from './emailAPI.js';

document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");

  contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
          alert("Please fill in all fields.");
          return;
      }

      const formData = {
          name: name,
          email: email,
          message: message
      };

      //conact from emailAPI
      try {
        const response = await contact(formData); // No need for .json() here
        if (response) {
            alert(response.message);
            contactForm.reset();
        } else {
            alert("Unexpected error. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("There was an error sending your message. Please try again later.");
    }
});
});
