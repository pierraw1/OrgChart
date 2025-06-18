// 📊 Chargement de Google Charts
google.charts.load("current", { packages: ["orgchart"] });
let originalData = [];

// 🧱 Raccourcis DOM
const fileInput = document.getElementById("fileInput");
const serviceSelect = document.getElementById("serviceSelect");
const resetBtn = document.getElementById("resetBtn");
const toggleDetails = document.getElementById("toggleDetails");
const optPoste = document.getElementById("optPoste");
const optEmail = document.getElementById("optEmail");
const optTel = document.getElementById("optTel");
const exportPngBtn = document.getElementById("exportPngBtn");
const exportJpgBtn = document.getElementById("exportJpgBtn");
const exportPdfBtn = document.getElementById("exportPdfBtn");

// 📌 Événements
fileInput.addEventListener("change", handleFile);
serviceSelect.addEventListener("change", filterAndDraw);
resetBtn.addEventListener("click", resetData);

[toggleDetails, optPoste, optEmail, optTel].forEach((el) =>
  el.addEventListener("change", () => drawOrgChart())
);

exportPngBtn.addEventListener("click", () => exportAsImage("png"));
exportJpgBtn.addEventListener("click", () => exportAsImage("jpeg"));
exportPdfBtn.addEventListener("click", exportToPDF);

// 🟢 Charts prêt
window.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("orgchartData");
  google.charts.setOnLoadCallback(() => {
    if (stored) {
      try {
        const data = JSON.parse(stored);
        loadDataAndDraw(data);
      } catch (err) {
        console.warn(
          "Erreur lors du chargement des données sauvegardées.",
          err
        );
      }
    }
  });
});

// 📂 Gérer l'import Excel
function handleFile(event) {
  const file = event.target.files[0];
  if (!file || !file.name.endsWith(".xlsx")) {
    alert("Veuillez sélectionner un fichier Excel (.xlsx)");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      localStorage.setItem("orgchartData", JSON.stringify(jsonData));
      loadDataAndDraw(jsonData);
    } catch (error) {
      alert("Erreur lors de la lecture du fichier.");
      console.error(error);
    }
  };
  reader.readAsArrayBuffer(file);
}

// 🧼 Réinitialiser les données
function resetData() {
  localStorage.removeItem("orgchartData");

  const newInput = fileInput.cloneNode(true);
  fileInput.parentNode.replaceChild(newInput, fileInput);
  newInput.addEventListener("change", handleFile);

  location.reload();
}

// 🎯 Charge les services et affiche
function loadDataAndDraw(data) {
  originalData = data;
  populateServiceOptions(originalData);
  filterAndDraw();
}

// 🧠 Générer options de service
function populateServiceOptions(data) {
  const services = getUniqueServices(data);
  serviceSelect.innerHTML =
    '<option value="TOUS">-- Tous les services --</option>';
  services.forEach((service) => {
    const option = document.createElement("option");
    option.value = service;
    option.textContent = service;
    serviceSelect.appendChild(option);
  });
}

// 🔍 Appliquer le filtre de service
function filterAndDraw() {
  const selectedService = serviceSelect.value;
  const filtered =
    selectedService === "TOUS"
      ? originalData
      : filterByService(originalData, selectedService);

  drawOrgChart(filtered);
}

// 🖼 Affichage de l'organigramme
function drawOrgChart(data = null) {
  if (!originalData || originalData.length === 0) return;

  const selectedService = serviceSelect.value;
  const source =
    data ||
    (selectedService === "TOUS"
      ? originalData
      : filterByService(originalData, selectedService));

  if (!Array.isArray(source) || source.length === 0) {
    document.getElementById("chart_div").innerHTML =
      "<p style='text-align:center; color:#888;'>Aucune donnée à afficher.</p>";
    return;
  }

  const dataTable = new google.visualization.DataTable();
  dataTable.addColumn("string", "Name");
  dataTable.addColumn("string", "Manager");

  source.forEach((row) => {
    const html = formatNode(row);
    dataTable.addRow([{ v: row.Nom, f: html }, row.Manager || ""]);
  });

  const chart = new google.visualization.OrgChart(
    document.getElementById("chart_div")
  );
  chart.draw(dataTable, { allowHtml: true });
}
