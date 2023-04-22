const report_test_data = 
[{"min":900,"max":"","name":"Mezcla para pancacke","id":44,"units":"Paquete","stock":600,"buyer":"PROPIETARIOS","since":"13/04/2023 00:00:00"},{"min":15,"max":"","name":"Filete de pollo","units":"Frasco","id":62,"stock":10,"buyer":"PROPIETARIOS","since":"13/04/2023 0:00:00"},{"min":1,"max":"","name":"Jabon lava loza","units":"Frasco","id":75,"stock":0,"buyer":"PROPIETARIOS","since":"25/2/2023 00:00:00"},{"min":20,"max":"","name":"Bolsas leche deslactosada 1100","units":"Paquete","id":79,"stock":12,"buyer":"PROPIETARIOS","since":""},{"min":20,"max":"","name":"Gatorade","units":"Frasco","id":91,"stock":13,"buyer":"PROPIETARIOS","since":""},{"min":20,"max":"","name":"Agua 600 Ml","units":"Frasco","id":93,"stock":18,"since":"","buyer":"PROPIETARIOS"},{"min":20,"max":"","name":"Banano","id":95,"units":"N/A","stock":10,"buyer":"PROPIETARIOS","since":""},{"min":150,"max":"","name":"Cafe Buen dia instantaneo","units":"Frasco","id":102,"stock":85,"buyer":"PROPIETARIOS","since":"6/1/2023 00:00:00"},{"min":5,"max":"","name":"Crema de mani","units":"Frasco","id":111,"stock":2,"buyer":"PROPIETARIOS","since":"12/04/2023 00:00:00"},{"min":200,"max":"","name":"jabon para manos","units":"ml","id":137,"stock":0,"buyer":"PROPIETARIOS","since":"13/12/2022 00:00:00"}];

const inventoryData = {
  ownersInventory: report_test_data,
  localsInventory: report_test_data
}

/* Events */
document.getElementById('reload-button').addEventListener('click', reloadReport);

// CODE TO GOOGLE AFTER THIS LINE

const TABLE_OWNERS_CONTENT_ID = 'table-owners-content';
const TABLE_OWNERS_BODY_ID = 'table-owners-body';
const TABLE_OWNERS_RESPONSE_ID = 'empty-owners-response';

const TABLE_LOCALS_CONTENT_ID = 'table-locals-content';
const TABLE_LOCALS_BODY_ID = 'table-locals-body';
const TABLE_LOCALS_RESPONSE_ID = 'empty-locals-response';

function reloadReport() {
  startLoadingScreen();
  getReportData();
}

function getReportData() {
  if ('undefined' !== typeof google) {
    google.script.run
      .withSuccessHandler(addContentToTable)
      .withFailureHandler(failResponse)
      .getInventoryData();
    return;
  }
  addContentToTable(inventoryData);
  stopLoadingScreen();
}

function addContentToTable(inventoryData) {  
  if(!inventoryData) {
    console.log('Empty object');
    failResponse();
    return;
  }
  console.table(inventoryData);
  renderData(inventoryData.ownersInventory, inventoryData.localsInventory);
  stopLoadingScreen();
}

function renderData(ownersDataFromInventory, localsDataFromInventory) {
  renderDataOnOwnersTable(ownersDataFromInventory);
  renderDataOnLocalsTable(localsDataFromInventory);
}

function renderDataOnOwnersTable(filteredData) {
  hideEmptyResponse(TABLE_OWNERS_CONTENT_ID, TABLE_OWNERS_RESPONSE_ID);
  renderDataOnTable(filteredData, TABLE_OWNERS_CONTENT_ID, TABLE_OWNERS_BODY_ID, TABLE_OWNERS_RESPONSE_ID);
}

function renderDataOnLocalsTable(filteredData) {
  hideEmptyResponse(TABLE_LOCALS_CONTENT_ID, TABLE_LOCALS_RESPONSE_ID);
  renderDataOnTable(filteredData, TABLE_LOCALS_CONTENT_ID, TABLE_LOCALS_BODY_ID, TABLE_LOCALS_RESPONSE_ID);
}

function renderDataOnTable(filteredData, tableContentId, tableBodyId, tableResponseId) {
  const tableBody = document.getElementById(tableBodyId);
  tableBody.textContent = '';
  let counter = 1;

  filteredData.forEach((item) => {
    if (!item.id) return;

    const tableRow = document.createElement('tr');

    const cellHeader = document.createElement('th');
    const cellHText = document.createTextNode(counter);

    cellHeader.appendChild(cellHText);
    cellHeader.setAttribute('scope', 'row');

    const nameCell = createCell(item.units? `${item.name} x ${item.units}` : item.name);
    const minStockCell = createCell(item.min);
    const currStockCell = createCell(item.stock);
    const pendingSince = createCell(item.since);

    tableRow.appendChild(cellHeader);
    tableRow.appendChild(nameCell);
    tableRow.appendChild(minStockCell);
    tableRow.appendChild(currStockCell);
    tableRow.appendChild(pendingSince);

    tableBody.appendChild(tableRow);
    counter++;
  });

  if (counter === 1) {
    showEmptyResponse(tableContentId, tableResponseId);
  }
}

function createCell(value) {
  const nameCell = document.createElement('td');
  const nameTextNode = document.createTextNode(value);
  nameCell.appendChild(nameTextNode);
  return nameCell;
}

function showEmptyResponse(tableContentId, tableResponseId) {
  document.getElementById(tableContentId).classList.add('hidden');
  document.getElementById(tableResponseId).classList.remove('hidden');
}

function hideEmptyResponse(tableContentId, tableEmptyResponseId) {
  document.getElementById(tableContentId).classList.remove('hidden');
  document.getElementById(tableEmptyResponseId).classList.add('hidden');
}

function failResponse() {
  showEmptyResponse(TABLE_LOCALS_RESPONSE_ID, TABLE_LOCALS_CONTENT_ID);
  showEmptyResponse(TABLE_OWNERS_RESPONSE_ID, TABLE_OWNERS_CONTENT_ID);
  stopLoadingScreen();
}

function createItemNameWithUnit(name, unit) {
  return unit? `${name} x ${unit}` : name;
}
