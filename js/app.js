google.charts.load("current", { packages: ["orgchart"] });
let originalData = [];

document.getElementById("fileInput").addEventListener("change", handleFile);
document
  .getElementById("serviceSelect")
  .addEventListener("change", filterAndDraw);
document.getElementById("exportPngBtn").addEventListener("click", exportToPNG);
document.getElementById("exportPdfBtn").addEventListener("click", exportToPDF);
document.getElementById("exportSvgBtn").addEventListener("click", exportToSVG);
document
  .getElementById("toggleDetails")
  .addEventListener("change", drawOrgChart);
document.getElementById("optPoste").addEventListener("change", drawOrgChart);
document.getElementById("optEmail").addEventListener("change", drawOrgChart);
document.getElementById("optTel").addEventListener("change", drawOrgChart);

document.getElementById("resetBtn").addEventListener("click", () => {
  localStorage.removeItem("orgchartData");
  location.reload();
});

google.charts.setOnLoadCallback(() => {
  console.log("Google Charts prêt.");
});

window.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("orgchartData");
  if (stored) {
    const data = JSON.parse(stored);
    loadDataAndDraw(data);
  }
});
function handleFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    localStorage.setItem("orgchartData", JSON.stringify(jsonData));
    loadDataAndDraw(jsonData);
  };

  reader.readAsArrayBuffer(file);
}

function populateServiceOptions(data) {
  const select = document.getElementById("serviceSelect");
  const services = getUniqueServices(data);
  select.innerHTML = '<option value="TOUS">-- Tous les services --</option>';
  services.forEach((service) => {
    const option = document.createElement("option");
    option.value = service;
    option.textContent = service;
    select.appendChild(option);
  });
}

function filterAndDraw() {
  const selectedService = document.getElementById("serviceSelect").value;
  const filtered =
    selectedService === "TOUS"
      ? originalData
      : filterByService(originalData, selectedService);

  drawOrgChart(filtered);
}

function drawOrgChart(data) {
  const dataTable = new google.visualization.DataTable();
  dataTable.addColumn("string", "Name");
  dataTable.addColumn("string", "Manager");

  data.forEach((row) => {
    const html = formatNode(row);
    dataTable.addRow([{ v: row.Nom, f: html }, row.Manager || ""]);
  });

  const chart = new google.visualization.OrgChart(
    document.getElementById("chart_div")
  );
  chart.draw(dataTable, { allowHtml: true });
}


function loadDataAndDraw(data) {
  originalData = data;
  populateServiceOptions(originalData);
  filterAndDraw();
}