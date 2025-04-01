
let rows = [];
let saved = false;
let rowCounter = 1;

function sha256(str) {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(str)).then(buf => {
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  });
}

async function login() {
  const user = document.getElementById("loginUser").value;
  const pass = document.getElementById("loginPass").value;
  const remember = document.getElementById("rememberMe").checked;

  const userHash = await sha256(user);
  const passHash = await sha256(pass);

  if (userHash === storedUserHash && passHash === storedPassHash) {
    if (remember) localStorage.setItem("loggedIn", "true");
    showApp();
  } else {
    document.getElementById("loginError").style.display = "block";
  }
}

function showApp() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("mainApp").classList.remove("hidden");
}

function addRow(data = {}) {
  const row = document.createElement("div");
  row.className = "row";

  const number = document.createElement("div");
  number.innerHTML = `<strong>${rowCounter++}</strong>`;
  number.style.minWidth = "20px";

  const date = createInput("Data", "date");
  const cliente = createInput("Nome Cliente");
  const rinnovo = createInput("Rinnovo");
  const avere = createInput("Avere");
  const username = createInput("Username");
  const server = createSelect("Server");

  const modificaBtn = document.createElement("button");
  modificaBtn.textContent = "Modifica";
  modificaBtn.onclick = () => toggleEditable([date, cliente, rinnovo, avere, username, server], true);

  row.append(number, date, cliente, rinnovo, avere, username, server, modificaBtn);
  document.getElementById("container").appendChild(row);
  rows.push({ row, date, cliente, rinnovo, avere, username, server });
  saved = false;
}

function toggleEditable(fields, editable) {
  fields.forEach(f => {
    const el = f.querySelector("input") || f.querySelector("select");
    if (el) el.disabled = !editable;
  });
}

function saveData() {
  rows.forEach(r => toggleEditable([r.date, r.cliente, r.rinnovo, r.avere, r.username, r.server], false));
  localStorage.setItem("gestioneClienti", JSON.stringify(rows.map(r => ({
    data: r.date.querySelector("input").value,
    cliente: r.cliente.querySelector("input").value,
    rinnovo: r.rinnovo.querySelector("input").value,
    avere: r.avere.querySelector("input").value,
    username: r.username.querySelector("input").value,
    server: r.server.querySelector("select").value
  }))));
  alert("Dati salvati!");
  saved = true;
}

function sortByDate() {
  rows.sort((a, b) => a.date.querySelector("input").value.localeCompare(b.date.querySelector("input").value));
  redraw();
}

function sortByName() {
  rows.sort((a, b) => a.cliente.querySelector("input").value.localeCompare(b.cliente.querySelector("input").value));
  redraw();
}

function redraw() {
  const container = document.getElementById("container");
  container.innerHTML = "";
  rows.forEach(r => container.appendChild(r.row));
}

function checkExit() {
  if (!saved) {
    if (confirm("Vuoi salvare prima di uscire?")) {
      saveData();
    }
  }
  alert("Puoi ora chiudere la pagina.");
}

function showSearch() {
  document.getElementById("searchBox").classList.remove("hidden");
}

function hideSearch() {
  document.getElementById("searchBox").classList.add("hidden");
}

function searchData() {
  const value = document.getElementById("searchInput").value.toLowerCase();
  rows.forEach(r => {
    const match = Object.values(r).some(c =>
      c.querySelector && c.querySelector("input") && c.querySelector("input").value.toLowerCase().includes(value)
    );
    r.row.style.background = match ? "#ffffcc" : "transparent";
  });
  hideSearch();
}

window.onload = () => {
  if (localStorage.getItem("loggedIn") === "true") showApp();
  const savedData = JSON.parse(localStorage.getItem("gestioneClienti") || "[]");
  savedData.forEach(data => addRow(data));
};
