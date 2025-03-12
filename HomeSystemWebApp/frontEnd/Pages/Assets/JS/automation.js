document.addEventListener("DOMContentLoaded", function () {
    let automationForm = document.getElementById("automation-form");

    function saveAutomation(event) {
        event.preventDefault();
        let device = document.getElementById("device").value;
        let start = document.getElementById("start-time").value;
        let end = document.getElementById("end-time").value;
        let status = document.getElementById("status").value;
        
        let automations = JSON.parse(localStorage.getItem("automations")) || [];
        automations.push({ device, start, end, status });
        localStorage.setItem("automations", JSON.stringify(automations));

        // Show Confirmation Message & Overlay
        showConfirmationMessage();

        automationForm.reset();
    }

    function showConfirmationMessage() {
        let overlay = document.getElementById("overlay");
        let confirmationMessage = document.getElementById("confirmation-message");

        overlay.style.display = "block";
        confirmationMessage.style.display = "block";

        confirmationMessage.innerHTML = `
            <h2>Automation Setup Completed!</h2>
            <p>Your automation for <strong>${document.getElementById("device").value}</strong> has been saved.</p>
            <button class="dashboard-btn" onclick="window.location.href='Dashboard.html'">
                Go to Dashboard <i class="fa fa-arrow-right"></i>
            </button>
        `;
    }

    automationForm.addEventListener("submit", saveAutomation);
});
