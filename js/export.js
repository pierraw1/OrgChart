function exportAsImage(format = "png") {
  const chart = document.getElementById("chart_div");

  html2canvas(chart, {
    scale: 3,
    backgroundColor: format === "png" ? null : "#ffffff", // fond transparent uniquement pour PNG
    useCORS: true,
  }).then((canvas) => {
    const margin = 30; // pixels de marge

    // 🔁 Créer un canvas élargi avec marge blanche
    const extendedCanvas = document.createElement("canvas");
    extendedCanvas.width = canvas.width + margin * 2;
    extendedCanvas.height = canvas.height + margin * 2;

    const ctx = extendedCanvas.getContext("2d");

    // Appliquer fond blanc si JPEG
    if (format === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, extendedCanvas.width, extendedCanvas.height);
    }

    ctx.drawImage(canvas, margin, margin);

    const link = document.createElement("a");
    link.download = `organigramme.${format === "jpeg" ? "jpg" : "png"}`;
    link.href = extendedCanvas.toDataURL(`image/${format}`, 1.0);
    link.click();
  });
}

function exportToPDF() {
  const chart = document.getElementById("chart_div");

  html2canvas(chart, {
    scale: 3,
    backgroundColor: "#ffffff",
  }).then((canvas) => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const imgData = canvas.toDataURL("image/png");
    const pageWidth = 297;
    const pageHeight = 210;
    const margin = 10;

    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
    pdf.save("organigramme.pdf");
  });
}
