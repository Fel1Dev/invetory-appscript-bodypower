/* Global events */
window.addEventListener('load', startUpForm);
document.getElementById('clear-fields').addEventListener('click', clearFields);
document.getElementById('form-inventory').addEventListener('submit', dataValidtation);

// Tab Panel events
document.getElementById('new-stock-tab').addEventListener('click', clickOnNewStock);
document.getElementById('input-tab').addEventListener('click', clickOnInput);
document.getElementById('output-tab').addEventListener('click', clickOnOutput);

// New Stock events
document.getElementById(NEW_STOCK_ID).addEventListener('change', processNewStock);
document.getElementById(ITEM_LIST_ID).addEventListener('change', getCurrentStock);
document.getElementById(STOCK_OUTPUT_TYPE_LIST).addEventListener('change', processStockOutputType);

// Input events
document.getElementById(QUANTITY_ID).addEventListener('change', processInQuantity);

//Output events
document.getElementById(OUT_QUANTITY_ID).addEventListener('change', processOutQuantity);
document.getElementById(OUTPUT_TYPE_LIST).addEventListener('change', processOutputTypeList);

function startUpForm() {
  // Only for local tests
  //stopLoadingScreen();
  // Only for local tests

  initCurrDateField();
  //Initialize lists
  loadItemsData();
  loadSimpleListsData();
}

function initCurrDateField() {
  //set currentDate with timezone
  document.getElementById('record-date').value = getLocalDateAsValue();
}

function getLocalDateAsValue() {
  let local = new Date();
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
}

function createItemsOptions(itemsData) {
  const itemListInput = document.getElementById('item-list-options');
  itemsData.forEach((item) => {
    const option = document.createElement('option');
    option.value = item[1];
    option.text = `Cantidad actual: ${item[7]} ${item[4]}`;
    itemListInput.appendChild(option);
  });
}

function loadItemsData() {
  google.script.run.withSuccessHandler(createItemsOptions).getItemsData();
}

function createSimpleListsOptions(allListsData) {
  const usersListInput = document.getElementById('user-list-options');
  // const unitsListInput = document.getElementById('unit-list-options');
  const newOutTypesListInput = document.getElementById('new-output-list-options');
  const outOutTypesListInput = document.getElementById('output-list-options');
  allListsData.forEach((dataRow) => {
    // createListOption(unitsListInput, dataRow[0]);
    createListOption(usersListInput, dataRow[1]);
    createListOption(newOutTypesListInput, dataRow[3]);
    createListOption(outOutTypesListInput, dataRow[3]);
  });
  stopLoadingScreen();
}

function createListOption(inputElement, value) {
  if (value) {
    const option = document.createElement('option');
    option.value = value;
    inputElement.appendChild(option);
  }
}

function loadSimpleListsData() {
  google.script.run.withSuccessHandler(createSimpleListsOptions).getSimpleListsData();
}

function createRecord() {
  //read fields
  console.log('create record');
}

function getCurrentStock(event) {
  startLoadingScreen();
  const itemName = event.target.value;
  document.getElementById(NEW_STOCK_ID).value = '';
  //Call backed function to get only one row
  if (itemName) {
    searchItemData(itemName);
    return;
  }
  updateCurrentStock('');
  blockNewQuantity();
  hideStockInputFields();
  hideStockOutputFields();
}

function searchItemData(name) {
  google.script.run
    .withSuccessHandler(processItemData)
    .withFailureHandler(processEmptyItemData)
    .getSingleItemData(name);
}

function processItemData(itemData) {
  if (itemData) {
    unBlockNewStock();
    updateCurrentStock(parseInt(itemData));
  }
}

function processEmptyItemData() {
  updateCurrentStock('');
}

function updateCurrentStock(value) {
  document.getElementById(CURRENT_STOCK_ID).value = value;
  stopLoadingScreen();
}

function getNewStock() {
  return document.getElementById(NEW_STOCK_ID).value;
}

function getCurrentStockValue() {
  return document.getElementById(CURRENT_STOCK_ID).value;
}

function processNewStock() {
  let newStock = getNewStock();
  if (newStock) {
    let currentStock = getCurrentStockValue();
    let difference = newStock - currentStock;
    updateDifferenceValue(difference);
    //TODO
    //  Check difference
    //  Enable Input or Output fields according difference value
    if (difference > 0) {
      showStockInputFields();
      hideStockOutputFields();
      return;
    }
    showStockOutputFields();
    hideStockInputFields();
  }
}

function updateDifferenceValue(newValue) {
  document.getElementById(DIFFERENCE_ID).value = newValue;
}

function processStockOutputType(event) {
  if (event.target.value.toUpperCase() === OUTPUT_TYPE_BAJA) {
    showStockOutputDetail();
    return;
  }
  hideStockOutputDetail();
}

function processInQuantity() {
  const inputQuantity = document.getElementById(QUANTITY_ID).value;
  if (inputQuantity > 0) {
    const currStock = document.getElementById(CURRENT_STOCK_ID).value;
    const finalStock = parseInt(currStock) + parseInt(inputQuantity);
    document.getElementById(FINAL_STOCK_INPUT_ID).value = finalStock;
    return;
  }
  document.getElementById(FINAL_STOCK_INPUT_ID).value = '';
}

function processOutQuantity() {
  const outputQuantity = document.getElementById(OUT_QUANTITY_ID).value;
  if (outputQuantity > 0) {
    const currStock = document.getElementById(CURRENT_STOCK_ID).value;
    const finalStock = parseInt(currStock) - parseInt(outputQuantity);
    document.getElementById(FINAL_STOCK_OUT_ID).value = finalStock;
    return;
  }
  document.getElementById(FINAL_STOCK_OUT_ID).value = '';
}

function processOutputTypeList(event) {
  if (event.target.value.toUpperCase() === OUTPUT_TYPE_BAJA) {
    showOutputDetail();
    return;
  }
  hideOutputDetail();
}

function dataValidtation(event) {
  event.preventDefault();
  let recordType = '';
  let formData = [];

  const difference = document.getElementById(DIFFERENCE_ID).value;
  const inputQuantity = document.getElementById(QUANTITY_ID).value;
  const outputQuantity = document.getElementById(OUT_QUANTITY_ID).value;

  if (inputQuantity) {
    recordType = ENTRADA_ROW_TYPE;
    formData = getFormDataAsInput();
  }

  if (outputQuantity) {
    recordType = SALIDA_ROW_TYPE;
    formData = getFormDataAsOutput();
  }

  if (difference > 0) {
    recordType = ENTRADA_ROW_TYPE;
    formData = getFormDataAsStockInput();
  }

  if (difference < 0) {
    recordType = SALIDA_ROW_TYPE;
    formData = getFormDataAsStockOutput();
  }

  google.script.run.withSuccessHandler(checkResponse).getFrontData(formData);
}

function getFormDataAsInput() {
  const userName = document.getElementById(USER_LIST_ID).value;
  const invoice = document.getElementById(INVOICE_ID).value;
  const recordDate = document.getElementById(RECORD_DATE_ID).value;
  const productName = document.getElementById(ITEM_LIST_ID).value;
  const inputQuantity = document.getElementById(QUANTITY_ID).value;
  const amount = document.getElementById(AMOUNT_ID).value;

  return ['', userName, invoice, recordDate, productName, inputQuantity, '', amount];
}

function getFormDataAsOutput() {
  const userName = document.getElementById(USER_LIST_ID).value;
  const recordDate = document.getElementById(RECORD_DATE_ID).value;
  const productName = document.getElementById(ITEM_LIST_ID).value;
  const outputQuantity = document.getElementById(OUT_QUANTITY_ID).value;
  const outType = document.getElementById(OUTPUT_TYPE_LIST).value;
  const outDesc = document.getElementById(OUTPUT_DESC).value;

  return ['', userName, recordDate, productName, '', outputQuantity, outType, outDesc];
}

function getFormDataAsStockInput() {}

function getFormDataAsStockOutput() {}

function checkResponse() {
  console.log('response');
}
