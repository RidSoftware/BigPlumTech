/* Reports.js */
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("downloadPdf").addEventListener("click", function() {
      // Using jsPDF from the imported library
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
  
      // Use the html() method to capture the reportContent
      doc.html(document.getElementById("reportContent"), {
        callback: function (doc) {
          doc.save("report.pdf");
        },
        x: 10,
        y: 10,
        html2canvas: { scale: 0.5 } // Adjust scale if needed for clarity
      });
    });
  });
  