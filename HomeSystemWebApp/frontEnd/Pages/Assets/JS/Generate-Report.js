document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("downloadPdf").addEventListener("click", function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Use the html() method to capture the reportContent
    doc.html(document.getElementById("reportContent"), {
      callback: function (doc) {
        // Instead of using doc.save() directly,
        // generate a Blob and create a temporary link to force download
        const pdfBlob = doc.output('blob');
        const blobUrl = URL.createObjectURL(pdfBlob);

        // Create a temporary anchor element with download attribute
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'report.pdf';
        document.body.appendChild(a);
        a.click();

        // Clean up: remove the anchor and revoke the Blob URL
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      },
      x: 10,
      y: 10,
      html2canvas: { scale: 0.5 } // Adjust scale if needed for clarity
    });
  });
});
