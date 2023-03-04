const ENTRADA_STOCK = 'ENTRADA_STOCK';
const SALIDA_STOCK = 'SALIDA_STOCK';
const ENTRADA = 'ENTRADA';
const SALIDA = 'SALIDA';

const INPUT_SHEET = 'Entradas';
const OUTPUT_SHEET = 'Salidas';

const INVENTORY_SHEET = 'Inventario';
const CREATE_SHEET = 'Crear registro';

const DATE_CELL = 'C6';
const NAME_CELL = 'C8';
const TOTAL_CELL = 'F13';
const UNIT_CELL = 'C10';
const TIPO_SALIDA_CELL = 'I13';
const AMOUNT_INPUT_CELL = 'C17';
const AMOUNT_OUTPUT_CELL = 'I17';
const INPUT_STOCK_AMOUNT_CELL = 'F17';
const NEW_STOCK_AMOUNT_CELL = 'C19';
const INVOICE_NUM_CELL = 'F11';
const USER_CELL = 'C4';

function doGet() {
  let template = HtmlService.createTemplateFromFile('index');
  let output = template.evaluate();
  output.addMetaTag('viewport', 'width=device-width, initial-scale=1');
  output.setTitle('.:: Body Power Lunch ::.');
  output.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
  return output;
}

function getHTMLPageContent(page = 'home-page') {
  const template = HtmlService.createTemplateFromFile(page);
  const contentHTML = template.evaluate();
  return { content: contentHTML.getContent(), pageName: page };
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getItemsData() {
  const SS = SpreadsheetApp.getActiveSpreadsheet();
  const itemSheet = SS.getSheetByName('Inventario');
  const itemsData = itemSheet.getDataRange().getDisplayValues();

  //Delete first 3 lines
  itemsData.splice(0, 3);
  return itemsData;
}

function getSimpleListsData() {
  const SS = SpreadsheetApp.getActiveSpreadsheet();
  const itemSheet = SS.getSheetByName('DatosListas');
  const itemsData = itemSheet.getDataRange().getDisplayValues();

  itemsData.splice(0, 1);
  return itemsData;
}

function getSingleItemData(itemName) {
  console.log('Search: ' + itemName);
  const columWithStock = 8;
  const SS = SpreadsheetApp.getActiveSpreadsheet();
  const itemSheet = SS.getSheetByName('Inventario');

  const txtFinder = itemSheet
    .createTextFinder(itemName)
    .matchCase(true)
    .matchEntireCell(true)
    .findNext();
  console.log('found: ' + txtFinder.getValue());
  const row = txtFinder.getRow();
  console.log('row: ' + row);
  let itemData = itemSheet.getRange(row, columWithStock).getValue();

  console.log('itemData: ' + itemData);
  if (!itemData) {
    throw Error();
  }
  return itemData;
}

function getFrontData(recordType, data) {
  console.log('getFrontData');
  console.log('RecordType: ' + recordType);
  console.log('Data from interface: ' + data);

  createRow(recordType, data);
}

function getInventoryData() {
  const fullInvetoryData = getAllInventoryData();
  const filteredData = filterLowerThanMinimal(fullInvetoryData);
  return filteredData;
}

function filterLowerThanMinimal(inventoryData) {
  return inventoryData.filter((row) => {
    if (row[8]) {
      const currStock = parseInt(row[7]);
      const minStock = parseInt(row[8]);
      if ((currStock - minStock) < 0) {
        return row;
      }
    }
  });
}

function getAllInventoryData() {
  const SS = SpreadsheetApp.getActiveSpreadsheet();
  const itemSheet = SS.getSheetByName('Inventario');
  const itemsData = itemSheet.getDataRange().getDisplayValues();

  //Delete first 3 lines
  itemsData.splice(0, 3);
  return itemsData;
}

function Inventario() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Inventario'), true);
}

function Salidas() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName(OUTPUT_SHEET), true);
}

function Entradas() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName(INPUT_SHEET), true);
}

/*
Create new record:
  Check the type of record to create (SALIDA o ENTRADA)
    Check the fiels in the filed
    Discard empty fields

  Get all data to create the new record from the form
    Clear all fields
  
  Create record
    Get the sheet according with the type of record
    Get the last row.
    Add the new data to the next row.
*/

function CreateRecord() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  const formSheet = spreadsheet.getSheetByName(CREATE_SHEET);
  const recordType = getRecordType(formSheet);

  const values = getValuesByType(recordType);

  createRow(recordType, values);

  ClearForm();
}

function getRecordType(formSheet) {
  const newStockRecord = formSheet.getRange(AMOUNT_INPUT_CELL).getValue();
  const inputRecord = formSheet.getRange(INPUT_STOCK_AMOUNT_CELL).getValue();
  const outputRecord = formSheet.getRange(AMOUNT_OUTPUT_CELL).getValue();

  if (newStockRecord) {
    if (formSheet.getRange('C21').getValue() === ENTRADA) {
      return ENTRADA_STOCK;
    }
    if (formSheet.getRange('C21').getValue() === SALIDA) {
      return SALIDA_STOCK;
    }
  }

  if (inputRecord) {
    return ENTRADA;
  }

  if (outputRecord) {
    return SALIDA;
  }

  var ui = SpreadsheetApp.getUi();
  ui.alert('Datos incompletos');
  return '';
}

function getValuesByType(recordType) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const formSheet = spreadsheet.getSheetByName(CREATE_SHEET);

  const date = formSheet.getRange(DATE_CELL).getValue();
  const itemName = formSheet.getRange(NAME_CELL).getValue();
  const userName = formSheet.getRange(USER_CELL).getValue();

  if (recordType === ENTRADA_STOCK) {
    console.log(ENTRADA_STOCK);
    return [
      [
        '', //empty
        userName, //user
        formSheet.getRange(INVOICE_NUM_CELL).getValue(), //# invoice
        date, //date
        itemName, //item
        formSheet.getRange(NEW_STOCK_AMOUNT_CELL).getValue(), //amount
        formSheet.getRange(UNIT_CELL).getValue(), //unit
        formSheet.getRange(TOTAL_CELL).getValue(), //total
      ],
    ];
  }

  if (recordType === ENTRADA) {
    console.log(ENTRADA);
    return [
      [
        '', //empty
        userName, //user
        formSheet.getRange(INVOICE_NUM_CELL).getValue(), //# invoice
        date, //date
        itemName, //item
        formSheet.getRange(INPUT_STOCK_AMOUNT_CELL).getValue(), //amount
        formSheet.getRange(UNIT_CELL).getValue(), //unit
        formSheet.getRange(TOTAL_CELL).getValue(), //total
      ],
    ];
  }

  if (recordType === SALIDA_STOCK) {
    console.log(SALIDA_STOCK);
    return [
      [
        '', //empty
        userName, //user
        date, //date
        itemName, //item
        formSheet.getRange(UNIT_CELL).getValue(), //unit
        Math.abs(formSheet.getRange('C19').getValue()), //amount
        formSheet.getRange(TIPO_SALIDA_CELL).getValue(), //outType
        '', //desc
      ],
    ];
  }

  if (recordType === SALIDA) {
    console.log(SALIDA);
    return [
      [
        '', //empty
        userName, //user
        date, //date
        itemName, //item
        formSheet.getRange(UNIT_CELL).getValue(), //unit
        formSheet.getRange(AMOUNT_OUTPUT_CELL).getValue(), //amount
        formSheet.getRange(TIPO_SALIDA_CELL).getValue(), //outType
        '', //Desc
      ],
    ];
  }
}

function createRow(recordType, values) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  console.log('values: ' + values);

  if (values === undefined) {
    console.log('exit empty');
    return '';
  }
  console.log('OK0');
  let destinationSheet;
  let itemColumn;
  let unitColum;
  let columnsToInsert = 8;
  console.log('OK1');
  if (recordType === ENTRADA || recordType === ENTRADA_STOCK) {
    destinationSheet = spreadsheet.getSheetByName(INPUT_SHEET);
    itemColumn = 'E';
    unitColumn = 7;
  }
  console.log('OK2');
  if (recordType === SALIDA || recordType === SALIDA_STOCK) {
    destinationSheet = spreadsheet.getSheetByName(OUTPUT_SHEET);
    itemColumn = 'D';
    unitColumn = 5;
  }

  console.log('OK3');
  const lastRowWithFormula = destinationSheet.getLastRow();
  console.log('OK4');
  console.log('lastRowWithFormula: ' + lastRowWithFormula);
  const lastRow =
    destinationSheet
      .getRange(itemColumn + (lastRowWithFormula + 1))
      .getNextDataCell(SpreadsheetApp.Direction.UP)
      .getRow() + 1;
      
  console.log('columnsToInsert: ' + columnsToInsert);
  console.log('lastRow: ' + lastRow);
  console.log('values: ' + values);

  destinationSheet.getRange(lastRow, 1, 1, columnsToInsert).setValues(values);
  
  //Assign formula to get units
  destinationSheet.getRange(lastRow, unitColumn).setFormula(`=IFNA(VLOOKUP(${itemColumn}${lastRow},ItemFieldsList,4, FALSE), "")`);
}

function ClearForm() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const formSheet = spreadsheet.getSheetByName('Crear registro');

  const rangeList = [
    USER_CELL,
    DATE_CELL,
    NAME_CELL,
    AMOUNT_INPUT_CELL,
    INPUT_STOCK_AMOUNT_CELL,
    AMOUNT_OUTPUT_CELL,
    INVOICE_NUM_CELL,
    UNIT_CELL,
    TOTAL_CELL,
    TIPO_SALIDA_CELL,
  ];
  for (let i = 0; i < rangeList.length; i++) {
    formSheet.getRange(rangeList[i]).clearContent();
  }
}

function Lock() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getRange('H10').activate();
  var protection = spreadsheet.getRange('H10').protect();
}
