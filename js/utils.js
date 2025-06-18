function getUniqueServices(data) {
  const unique = new Set();
  data.forEach((row) => {
    if (row.Service) unique.add(row.Service);
  });
  return [...unique];
}

function filterByService(data, service) {
  const servicePeople = data.filter((row) => row.Service === service);
  if (servicePeople.length === 0) return [];

  const namesInService = servicePeople.map((p) => p.Nom);
  const responsables = servicePeople.filter(
    (p) => !namesInService.includes(p.Manager)
  );
  const responsable = responsables[0];
  if (!responsable) return servicePeople;

  const adjusted = servicePeople.map((p) => {
    if (p.Nom === responsable.Nom) return { ...p, Manager: "" };
    if (!namesInService.includes(p.Manager))
      return { ...p, Manager: responsable.Nom };
    return p;
  });

  return adjusted;
}

function formatNode(row) {
  const showDetails = document.getElementById("toggleDetails").checked;
  const showPoste = document.getElementById("optPoste").checked;
  const showEmail = document.getElementById("optEmail").checked;
  const showTel = document.getElementById("optTel").checked;

  const style = `
      background-color: #ffffff;
      border: 1px solid #ccc;
      border-radius: 6px;
      padding: 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      font-size: 12px;
      color: #222;
      min-width: 160px;
    `;

  let html = `<div style="${style}"><strong>${row.Nom}</strong>`;

  if (showDetails) {
    if (showPoste && row.Poste) html += `<br><span>${row.Poste}</span>`;
    if (showEmail && row.Email) html += `<br><span>${row.Email}</span>`;
    if (showTel && row.Téléphone) html += `<br><span>${row.Téléphone}</span>`;
  }

  html += `</div>`;
  return html;
}
