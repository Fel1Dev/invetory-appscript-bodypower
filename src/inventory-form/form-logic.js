// /* Global events */
// window.addEventListener('load', startUpForm);
// document.getElementById('clear-fields').addEventListener('click', clearFields);
// document.getElementById('form-inventory').addEventListener('submit', dataValidation);

// // Tab Panel events
// document.getElementById(NEW_STOCK_TAB_ID).addEventListener('click', clickOnNewStock);
// document.getElementById(INPUT_TAB_ID).addEventListener('click', clickOnInput);
// document.getElementById(OUTPUT_TAB_ID).addEventListener('click', clickOnOutput);

// // New Stock events
// document.getElementById(ITEM_LIST_ID).addEventListener('change', getCurrentStock);
// document.getElementById(NEW_STOCK_ID).addEventListener('input', processNewStock);
// document.getElementById(STOCK_OUTPUT_TYPE_LIST).addEventListener('input', processStockOutputType);

// // Input events
// document.getElementById(QUANTITY_ID).addEventListener('input', processInQuantity);

// //Output events
// document.getElementById(OUT_QUANTITY_ID).addEventListener('input', processOutQuantity);
// document.getElementById(OUTPUT_TYPE_LIST).addEventListener('input', processOutputTypeList);


// CODE TO GOOGLE ->

function startUpForm() {
  startLoadingScreen();

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

function createItemsOptionsStopLoader(itemsData) {
  createItemsOptions(itemsData);
  stopLoadingScreen();
}

function createItemsOptions(itemsData) {
  const itemListInput = document.getElementById('item-list-options');
  itemListInput.textContent = '';
  itemsData.forEach((item) => {
    const option = document.createElement('option');
    option.value = item[1];
    option.text = `Cantidad actual: ${item[7]} ${item[4]}`;
    itemListInput.appendChild(option);
  });
}

function loadItemsData() {
  if ('undefined' !== typeof google) {
    google.script.run.withSuccessHandler(createItemsOptions).getItemsData();
    return;
  }
  stopLoadingScreen();
}

function loadItemsDataWithStopLoader() {
  if ('undefined' !== typeof google) {
    google.script.run.withSuccessHandler(createItemsOptionsStopLoader).getItemsData();
    return;
  }
  stopLoadingScreen();
}

function createSimpleListsOptions(allListsData) {
  const usersListInput = document.getElementById('user-list-options');
  const newOutTypesListInput = document.getElementById('new-output-list-options');
  const outOutTypesListInput = document.getElementById('output-list-options');
  allListsData.forEach((dataRow) => {
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
  if ('undefined' !== typeof google)
    google.script.run.withSuccessHandler(createSimpleListsOptions).getSimpleListsData();
}

function createRecord() {
  //read fields
  console.log('create record');
}

function getCurrentStock(event) {
  startLoadingScreen();
  const itemName = event.target.value;
  setNewStock('');
  //Call backed function to get only one row
  if (itemName) {
    searchItemData(itemName);
    return;
  }
  updateCurrentStock('');
  lockNewStock();
  hideStockInputFields();
  hideStockOutputFields();

  disableInputFields();
  disableOutputFields();

  stopLoadingScreen();
}

function searchItemData(name) {
  if ('undefined' !== typeof google) {
    google.script.run
      .withSuccessHandler(processItemData)
      .withFailureHandler(processEmptyItemData)
      .getSingleItemData(name);
    return;
  }

  updateCurrentStock(10);
  unlockNewStockIfActive();
  enableInputFieldsIfActive();
  enableOutputFieldsIfActive();
  stopLoadingScreen();
}

function processItemData(itemData) {
  if (itemData) {
    updateCurrentStock(parseInt(itemData));
    unlockNewStockIfActive();
    enableInputFieldsIfActive();
    enableOutputFieldsIfActive();
    stopLoadingScreen();
  }
}

function processEmptyItemData() {
  updateCurrentStock('');
  lockNewStock();
  hideStockInputFields();
  hideStockOutputFields();

  disableInputFields();
  disableOutputFields();

  stopLoadingScreen();
}

function updateCurrentStock(value) {
  document.getElementById(CURRENT_STOCK_ID).value = value;
}

function getNewStock() {
  return document.getElementById(NEW_STOCK_ID).value;
}

function setNewStock(val) {
  document.getElementById(NEW_STOCK_ID).value = val;
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
