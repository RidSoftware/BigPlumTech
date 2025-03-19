import { contact } from './emailAPI.js';

document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");

  contactForm.addEventListener("submit", function (event) {
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

      fetch("/api/contact", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
          alert(data.message);
          contactForm.reset();
      })
      .catch(error => {
          console.error("Error:", error);
          alert("There was an error sending your message. Please try again later.");
      });
  });
});
