const DEPLOYED_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyMT571uilBB60oEgRFxRq__N0RuZgvYrten01IxSklbQDW9Sjc9xf7d-9EDpSgWlKG/exec";

let inventoryData = [];

function fetchInventory() {
  fetch(DEPLOYED_SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
      inventoryData = data;
      renderTable(data);
    });
}

function renderTable(data) {
  const tbody = document.getElementById("inventory-table-body");
  tbody.innerHTML = "";

  data.forEach(row => {
    const [itemCode, itemName, daily, currentQty] = row;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${itemCode}</td>
      <td>${itemName}</td>
      <td>${daily}</td>
      <td>${currentQty}</td>
      <td>
        <input type="number" id="qty-${itemName}" placeholder="Qty" style="width: 60px;">
        <button onclick="updateQty('${itemName}', true)">+</button>
        <button onclick="updateQty('${itemName}', false)">-</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function updateQty(itemName, isAdd) {
  const input = document.getElementById(`qty-${itemName}`);
  const value = parseInt(input.value);
  if (isNaN(value) || value <= 0) {
    alert("Enter a valid quantity.");
    return;
  }

  const finalQty = isAdd ? value : -value;

  fetch(DEPLOYED_SCRIPT_URL + `?action=update&itemName=${encodeURIComponent(itemName)}&qty=${finalQty}`)
    .then(res => res.text())
    .then(response => {
      alert(response);
      fetchInventory(); // Refresh data
    });
}

function filterTable() {
  const keyword = document.getElementById("search").value.toLowerCase();
  const filtered = inventoryData.filter(row => row[1].toLowerCase().includes(keyword));
  renderTable(filtered);
}

window.onload = fetchInventory;
