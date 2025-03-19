document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("forgotPasswordForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent page reload

        const resetEmail = document.getElementById("resetEmail").value;
        const errorMessage = document.getElementById("resetErrorMessage");

        if (!resetEmail) {
            errorMessage.textContent = "Please enter your email.";
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: resetEmail })
            });

            const data = await response.json();
            if (response.ok) {
                alert("Password reset instructions have been sent to your email.");
                window.location.href = "login.html"; // Redirect back to login
            } else {
                errorMessage.textContent = "Error: " + data.error;
            }
        } catch (error) {
            console.error("Error:", error);
            errorMessage.textContent = "An error occurred while processing your request.";
        }
    });
});
