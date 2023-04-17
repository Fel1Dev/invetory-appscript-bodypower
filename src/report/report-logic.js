const report_test_data = [
  [ '123', 'Copas 2 onz con tapa', '0', '', '', '50', '', '50', '60', 'PROPIETARIOS', '', '', '', '', '', '', '', '', '', '', '', '', ],
  [ '126', 'Aceite de Oliva', '0', '', '', '251', '', '251', '300', 'PROPIETARIOS', '', '', '', '', '', '', '', '', '', '', '', '',],
  [ '132', 'Naranjas', '', '', '', '48', '42', '6', '10', 'PROPIETARIOS', new Date(), '', '', '', '', '', '', '', '', '', '', '',],
  [ '138', 'bolsas ziplo grande', '', '', '', '30', '', '30', '40', 'PEDIDO EN EL LOCAL', new Date(), '', '','', '',  '', '', '', '', '', '', '', ],
  [ '141', 'Chicles Tridents', '', 'Unidades', 'Unidades', '60', '', '60', '70', '120', 'PEDIDO EN EL LOCAL', '5/4/2023', '', '', '', '', '', '', '', '', '', '',],
];

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

  filteredData.forEach((row) => {
    if (!row[1]) return;

    const tableRow = document.createElement('tr');

    const cellHeader = document.createElement('th');
    const cellHText = document.createTextNode(counter);

    cellHeader.appendChild(cellHText);
    cellHeader.setAttribute('scope', 'row');

    const nameCell = createCell(createItemNameWithUnit(row[1], row[4]));
    const minStockCell = createCell(row[8]);
    const currStockCell = createCell(row[7]);
    const pendingSince = createCell(row[11]);

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
  if (unit) return `${name} x ${unit}`;
  return name;
}
