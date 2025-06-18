function exportAsImage(format = "png") {
  const chartContainer = document.getElementById("chart_div");

  // Mesurer toute la zone du contenu réel
  const originalWidth = chartContainer.scrollWidth;
  const originalHeight = chartContainer.scrollHeight;

  html2canvas(chartContainer, {
    backgroundColor: format === "png" ? null : "#ffffff",
    width: originalWidth,
    height: originalHeight,
    scale: 3,
    useCORS: true,
  }).then((canvas) => {
    const margin = 30;

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = canvas.width + margin * 2;
    finalCanvas.height = canvas.height + margin * 2;

    const ctx = finalCanvas.getContext("2d");

    if (format === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    }

    ctx.drawImage(canvas, margin, margin);

    const link = document.createElement("a");
    link.download = `organigramme.${format === "jpeg" ? "jpg" : "png"}`;
    link.href = finalCanvas.toDataURL(`image/${format}`, 1.0);
    link.click();
  });
}

function exportToPDF() {
  const chart = document.getElementById("chart_div");

  const originalWidth = chart.scrollWidth;
  const originalHeight = chart.scrollHeight;

  html2canvas(chart, {
    width: originalWidth,
    height: originalHeight,
    scale: 3,
    backgroundColor: "#ffffff",
  }).then((canvas) => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 297;
    const pageHeight = 210;
    const margin = 10;

    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
    pdf.save("organigramme.pdf");
  });
}
  