document.addEventListener("DOMContentLoaded", function () {
    generateReports();
});

// Generate Reports (Resets on Reload)
function generateReports() {
    const reportContainer = document.getElementById("report-list");

    // Example Critical Reports
    const criticalReports = [
        { id: 1, device: "Air Conditioning", location: "Bedroom", consumption: 5.2, recommendation: "Reduce usage duration and set an auto-off timer." },
        { id: 2, device: "Refrigerator", location: "Kitchen", consumption: 3.1, recommendation: "Check for faulty wiring or overstocked fridge blocking air circulation." },
        { id: 3, device: "Living Room Lights", location: "Living Room", consumption: 2.5, recommendation: "Consider using motion sensors to automatically turn off lights when not needed." }
    ];

    // Remove previous acknowledgment records on refresh
    localStorage.removeItem("acknowledgedReports");

    // Display Reports
    reportContainer.innerHTML = "";
    criticalReports.forEach(report => {
        const reportCard = document.createElement("div");
        reportCard.classList.add("report-card");
        reportCard.setAttribute("data-id", report.id);
        reportCard.innerHTML = `
            <h3><i class="fa fa-bolt"></i> ${report.device} - ${report.location}</h3>
            <p><strong>Energy Consumed:</strong> ${report.consumption} kWh</p>
            <p><strong>Recommendation:</strong> ${report.recommendation}</p>
            <button class="acknowledge-btn" onclick="acknowledgeReport(${report.id})">
                Acknowledge <i class="fa fa-check-circle"></i>
            </button>
        `;

        reportContainer.appendChild(reportCard);
    });
}

// Handle Acknowledgment
function acknowledgeReport(reportId) {
    const reportCard = document.querySelector(`.report-card[data-id='${reportId}']`);

    if (reportCard) {
        reportCard.style.transition = "opacity 0.5s, transform 0.5s";
        reportCard.style.opacity = "0";
        reportCard.style.transform = "translateY(-10px)";

        setTimeout(() => {
            reportCard.remove();

            // Check if all reports are gone
            if (document.querySelectorAll(".report-card").length === 0) {
                document.getElementById("report-list").innerHTML = `
                    <div class="no-report">
                        <h3><i class="fa fa-smile-o"></i> No Critical Reports!</h3>
                        <p>Your home energy usage is optimal. Great job! 🎉</p>
                    </div>
                `;
            }
        }, 500);
    }
}

// Function to handle acknowledgment with smooth fade-out animation
function acknowledgeReport(reportId) {
    const reportCard = document.querySelector(`.report-card[data-id='${reportId}']`);
    
    if (reportCard) {
        // Add fade-out effect
        reportCard.style.transition = "opacity 0.5s, transform 0.5s";
        reportCard.style.opacity = "0";
        reportCard.style.transform = "translateY(-10px)";

        // Remove after animation completes
        setTimeout(() => {
            reportCard.remove();

            // Store acknowledged report in localStorage
            let acknowledgedReports = JSON.parse(localStorage.getItem("acknowledgedReports")) || [];
            acknowledgedReports.push(reportId);
            localStorage.setItem("acknowledgedReports", JSON.stringify(acknowledgedReports));

            // If no reports left, show success message
            if (document.querySelectorAll(".report-card").length === 0) {
                document.getElementById("report-list").innerHTML = `
                    <div class="no-report">
                        <h3><i class="fa fa-smile-o"></i> No Critical Reports!</h3>
                        <p>Your home energy usage is optimal. Great job! 🎉</p>
                    </div>
                `;
            }
        }, 500); // Delay to match CSS transition
    }
}
