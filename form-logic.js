
/* Initial events */
window.addEventListener("load", startUpForm);
document.getElementById('clear-fields').addEventListener('click', clearFields);
document.getElementById('create-record').addEventListener('click', createRecord);
document.getElementById(NEW_QUANTITY_ID).addEventListener('change', processNewStock);
document.getElementById(ITEM_LIST_ID).addEventListener('change', getCurrentStock );
document.getElementById('new-output-type-list').addEventListener('change', processOutputType);

document.getElementById('new-stock-tab').addEventListener('click', clickOnNewStock);
document.getElementById('input-tab').addEventListener('click', clickOnInput);
document.getElementById('output-tab').addEventListener('click', clickOnOutput);


function startUpForm() {
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
  return local.toJSON().slice(0,10);
}

function createItemsOptions( itemsData ) {
  const itemListInput = document.getElementById('item-list-options');
  itemsData.forEach(item => {
    const option = document.createElement('option');
    option.value = item[1];
    option.text =  `Cantidad actual: ${item[7]} ${item[4]}`;
    itemListInput.appendChild(option);
  });
}

function loadItemsData() {
  google.script.run.withSuccessHandler( createItemsOptions ).getItemsData();
}

function createSimpleListsOptions( allListsData ) {
  const usersListInput = document.getElementById('user-list-options');
  // const unitsListInput = document.getElementById('unit-list-options');
  const newOutTypesListInput = document.getElementById('new-output-list-options');
  const outOutTypesListInput = document.getElementById('output-list-options');
  allListsData.forEach(dataRow => {
    // createListOption(unitsListInput, dataRow[0]);
    createListOption(usersListInput, dataRow[1]);
    createListOption(newOutTypesListInput, dataRow[3]);
    createListOption(outOutTypesListInput, dataRow[3]);
  });
  stopLoadingScreen();
}

function createListOption(inputElement, value) {
  if(value) {
    const option = document.createElement('option');
    option.value = value;
    inputElement.appendChild(option);
  }
}

function loadSimpleListsData() {
  google.script.run.withSuccessHandler( createSimpleListsOptions ).getSimpleListsData();
}

function createRecord() {
  //read fields
  console.log('create record');
    
}

function getCurrentStock(event) {
  startLoadingScreen();
  const itemName = event.target.value
  document.getElementById(NEW_QUANTITY_ID).value = '';
  //Call backed function to get only one row
  if(itemName) {
    searchItemData(itemName)
  } else {
    updateCurrentStock('');
    blockNewQuantity();
    hideStockInputFields();
    hideStockOutputFields();
  }
}

function searchItemData( name ) {
  google.script.run.withSuccessHandler( processItemData ).withFailureHandler( processEmptyItemData ).getSingleItemData(name);
}

function processItemData( itemData ) {
  if(itemData){
    unBlockNewQuantity();
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

function getNewQuantityValue() {
  return document.getElementById(NEW_QUANTITY_ID).value;
}

function getStockValue() {
  return document.getElementById(CURRENT_STOCK_ID).value;
}

function processNewStock() {
  let newQuantity = getNewQuantityValue();
  if(newQuantity) {
    let currentStock = getStockValue();
    let difference = newQuantity - currentStock;
    updateDifferenceValue(difference);
    //TODO
    //  Check difference
    //  Enable Input or Output fields according difference value
    if(difference > 0) {
      showStockInputFields();
      hideStockOutputFields();
    } else {
      showStockOutputFields();
      hideStockInputFields();
    }
  }
}

function updateDifferenceValue(newValue) {
  document.getElementById('final-stock-new').value = newValue;
}

function processOutputType(event) { 
  //  If out type
  //     Enable Detail field when outputType is 'Baja'
  if(event.target.value.toUpperCase() === OUTPUT_TYPE_BAJA) {
    showStockOutputDetail();
  } else {
    hideStockOutputDetail();
  }
}

function dataValidtation(form) {
  event.preventDefault();
  console.log(form);
  google.script.run.withSuccessHandler( checkResponse ).getFrontData(form);
  
}
function checkResponse() {
  console.log('response');
}