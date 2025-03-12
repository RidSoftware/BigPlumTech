document.addEventListener("DOMContentLoaded", function () {
    let automationForm = document.getElementById("automation-form");
    let overlay = document.getElementById("confirmationOverlay");
    let confirmationMessage = document.getElementById("confirmation-message");

    function saveAutomation(event) {
        event.preventDefault();
        let device = document.getElementById("device").value;
        let start = document.getElementById("start-time").value;
        let end = document.getElementById("end-time").value;
        let status = document.getElementById("status").value;
        
        let automations = JSON.parse(localStorage.getItem("automations")) || [];
        automations.push({ device, start, end, status });
        localStorage.setItem("automations", JSON.stringify(automations));

        // Show Overlay and Confirmation Message
        overlay.style.display = "block";
        confirmationMessage.style.display = "flex";

        // Add Confirmation Message Content
        confirmationMessage.innerHTML = `
            <h2>Automation Setup Completed!</h2>
            <p>Your automation for <strong>${device}</strong> has been saved.</p>
            <button class="dashboard-btn" onclick="window.location.href='Dashboard.html'">
                Go to Dashboard →
            </button>
        `;
    }

    automationForm.addEventListener("submit", saveAutomation);
});
