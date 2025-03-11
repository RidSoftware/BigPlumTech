document.addEventListener("DOMContentLoaded", function () {
    let automationForm = document.getElementById("automation-form");
    let automationList = document.getElementById("automation-list");

    function loadAutomations() {
        automationList.innerHTML = "";
        let automations = JSON.parse(localStorage.getItem("automations")) || [];
        
        automations.forEach((auto, index) => {
            let automationItem = document.createElement("div");
            automationItem.className = "automation-item";
            automationItem.innerHTML = `
                <p>${auto.device} - ${auto.status} (${auto.start} to ${auto.end})</p>
                <button class="delete-automation" onclick="deleteAutomation(${index})">Delete</button>
            `;
            automationList.appendChild(automationItem);
        });
    }

    function saveAutomation(event) {
        event.preventDefault();
        let device = document.getElementById("device").value;
        let start = document.getElementById("start-time").value;
        let end = document.getElementById("end-time").value;
        let status = document.getElementById("status").value;
        
        let automations = JSON.parse(localStorage.getItem("automations")) || [];
        automations.push({ device, start, end, status });
        localStorage.setItem("automations", JSON.stringify(automations));
        
        loadAutomations();
        automationForm.reset();
    }

    function deleteAutomation(index) {
        let automations = JSON.parse(localStorage.getItem("automations")) || [];
        automations.splice(index, 1);
        localStorage.setItem("automations", JSON.stringify(automations));
        loadAutomations();
    }

    automationForm.addEventListener("submit", saveAutomation);
    loadAutomations();

});
