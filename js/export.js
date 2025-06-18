function exportToPNG() {
  html2canvas(document.getElementById("chart_div")).then((canvas) => {
    const link = document.createElement("a");
    link.download = "organigramme.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

function exportToPDF() {
  html2canvas(document.getElementById("chart_div")).then((canvas) => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const imgData = canvas.toDataURL("image/png");
    const width = 210; 
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("organigramme.pdf");
  });
}

function exportToSVG() {
  const svg = document.querySelector("#chart_div svg");
  if (!svg) return alert("SVG non trouvé !");
  const serializer = new XMLSerializer();
  const svgBlob = new Blob([serializer.serializeToString(svg)], {
    type: "image/svg+xml",
  });
  const url = URL.createObjectURL(svgBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "organigramme.svg";
  link.click();
}
