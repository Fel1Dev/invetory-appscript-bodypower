/* Events */
//document.getElementById('reload-button').addEventListener('click', reloadReport);

const TABLE_BODY_ID = 'table-body';

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
  stopLoadingScreen();
}

function addContentToTable(dataFromInventory) {
  console.log(dataFromInventory);
  const filteredData = processResponse(dataFromInventory);
  renderDataOnTable(dataFromInventory);
  stopLoadingScreen();
}

function processResponse(inventoryData) {
  return filterLowerThanMinimal(inventoryData);
}

function filterLowerThanMinimal(inventoryData) {
  console.log();
  return inventoryData.map((row) => {
    return row;
  });
}

function renderDataOnTable(filteredData) {
  const tableBody = document.getElementById(TABLE_BODY_ID);

  let counter = 1;
  filteredData.forEach((row) => {
    console.log(row);
    if (!row[1]) return;

    const tableRow = document.createElement('tr');

    const cellHeader = document.createElement('th');
    const cellHText = document.createTextNode(counter);

    cellHeader.appendChild(cellHText);
    cellHeader.setAttribute('scope', 'row');

    const nameCell = document.createElement('td');
    const minStockCell = document.createElement('td');
    const currStockCell = document.createElement('td');

    const nameTextNode = document.createTextNode(row[1]);
    const minTextNode = document.createTextNode(row[8]);
    const currTextNode = document.createTextNode(row[7]);

    nameCell.appendChild(nameTextNode);
    minStockCell.appendChild(minTextNode);
    currStockCell.appendChild(currTextNode);

    console.log(nameCell);
    console.log(minStockCell);
    console.log(currStockCell);

    console.log(tableRow);

    tableRow.appendChild(cellHeader);
    tableRow.appendChild(nameCell);
    tableRow.appendChild(minStockCell);
    tableRow.appendChild(currStockCell);

    console.log(tableBody);

    tableBody.appendChild(tableRow);
    counter++;
  });
}

function failResponse() {
  errorResponse();
  stopLoadingScreen();
}
