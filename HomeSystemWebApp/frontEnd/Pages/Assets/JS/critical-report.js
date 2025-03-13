document.addEventListener("DOMContentLoaded", function () {
    initializeReports();
    generateReports();
});

// 🚀 Function: Initialize Test Reports in LocalStorage
function initializeReports() {
    if (!localStorage.getItem("criticalReports")) {
        const testReports = [
            { id: 1, device: "Air Conditioning", location: "Bedroom", consumption: 5.2, recommendation: "Reduce usage duration and set an auto-off timer." },
            { id: 2, device: "Refrigerator", location: "Kitchen", consumption: 3.1, recommendation: "Check for faulty wiring or overstocked fridge blocking air circulation." },
            { id: 3, device: "Living Room Lights", location: "Living Room", consumption: 2.5, recommendation: "Consider using motion sensors to automatically turn off lights when not needed." }
        ];
        localStorage.setItem("criticalReports", JSON.stringify(testReports));
    }

    // Ensure acknowledged reports exist
    if (!localStorage.getItem("acknowledgedReports")) {
        localStorage.setItem("acknowledgedReports", JSON.stringify([]));
    }
}

// 🚀 Function: Generate Reports Dynamically
function generateReports() {
    const reportContainer = document.getElementById("report-list");
    reportContainer.innerHTML = "";

    let reports = JSON.parse(localStorage.getItem("criticalReports")) || [];
    let acknowledgedReports = JSON.parse(localStorage.getItem("acknowledgedReports")) || [];

    if (reports.length === 0) {
        reportContainer.innerHTML = `
            <div class="no-report">
                <h3><i class="fa fa-smile-o"></i> No Critical Reports!</h3>
                <p>Your home energy usage is optimal. Great job! 🎉</p>
            </div>
        `;
        return;
    }

    reports.forEach(report => {
        if (!acknowledgedReports.includes(report.id)) {  // Only show unacknowledged reports
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
        }
    });
}

// 🚀 Function: Acknowledge Report & Update Storage
function acknowledgeReport(reportId) {
    let acknowledgedReports = JSON.parse(localStorage.getItem("acknowledgedReports")) || [];
    
    if (!acknowledgedReports.includes(reportId)) {
        acknowledgedReports.push(reportId);
        localStorage.setItem("acknowledgedReports", JSON.stringify(acknowledgedReports));
    }

    // Fade out and remove report
    const reportCard = document.querySelector(`.report-card[data-id='${reportId}']`);
    if (reportCard) {
        reportCard.style.transition = "opacity 0.5s, transform 0.5s";
        reportCard.style.opacity = "0";
        reportCard.style.transform = "translateY(-10px)";

        setTimeout(() => {
            reportCard.remove();
            checkIfNoReportsLeft();
        }, 500);
    }
}

// 🚀 Function: Check If No Reports Left
function checkIfNoReportsLeft() {
    let reports = JSON.parse(localStorage.getItem("criticalReports")) || [];
    let acknowledgedReports = JSON.parse(localStorage.getItem("acknowledgedReports")) || [];

    if (reports.length === acknowledgedReports.length) {
        document.getElementById("report-list").innerHTML = `
            <div class="no-report">
                <h3><i class="fa fa-smile-o"></i> No Critical Reports!</h3>
                <p>Your home energy usage is optimal. Great job! 🎉</p>
            </div>
        `;
    }
}

// 🚀 Function: Add New Report (For Testing Purposes)
function addTestReport() {
    let reports = JSON.parse(localStorage.getItem("criticalReports")) || [];
    
    let newReport = {
        id: reports.length + 1,
        device: "Water Heater",
        location: "Bathroom",
        consumption: 4.8,
        recommendation: "Lower the temperature setting to save energy."
    };

    reports.push(newReport);
    localStorage.setItem("criticalReports", JSON.stringify(reports));
    generateReports();
}

// Initialize reports on page load
initializeReports();
