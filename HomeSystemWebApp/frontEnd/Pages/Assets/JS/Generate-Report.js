document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("downloadPdf").addEventListener("click", function () {
      // Ensure jsPDF is available
      if (!window.jspdf) {
          console.error("jsPDF is not loaded");
          return;
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF("p", "mm", "a4"); // A4 size in portrait mode

      // Get the content of the report
      const reportContent = document.getElementById("reportContent");

      // Use html2canvas to render the section
      html2canvas(reportContent, {
          scale: 2, // Improves quality
          useCORS: true,
          logging: false
      }).then(canvas => {
          const imgData = canvas.toDataURL("image/png");
          const imgWidth = 190; // Fit to A4 width
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          doc.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
          doc.save("Report.pdf");
      }).catch(error => {
          console.error("Error capturing report content:", error);
      });
  });
});
