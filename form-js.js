
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

function clearFields() {
  let keepDate = document.getElementById("keep-date").checked;
  let keepUserList = document.getElementById("keep-user-list").checked;

  if(!keepDate) {
      document.getElementById(REACORD_DATE_ID).value = "";
  }
  if(!keepUserList) {
      document.getElementById(USER_LIST_ID).value = "";
  }       
  // General fields
  document.getElementById(ITEM_LIST_ID).value = "";
  document.getElementById(CURRENT_STOCK_ID).value = "";
  // document.getElementById("unit-list").value = "";
  
  // New Stock
  clearNewStockFields();
  
  // Input
  clearInputFields();
  
  // Output
  clearOutputFields();
}

function clearNewStockFields() {
  // New Stock
  document.getElementById(NEW_QUANTITY_ID).value = "";
  document.getElementById("final-stock-new").value = "";

  document.getElementById("new-stock-invoice").value = "";
  document.getElementById("new-stock-amount").value = "";

  document.getElementById("new-output-type-list").value = "";
  document.getElementById("new-output-desc").value = "";

  hideStockFields();
}

function clearInputFields() {
  // Input
  document.getElementById("invoice").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("final-stock-input").value = "";
}

function clearOutputFields() {
  // Output
  document.getElementById("out-quantity").value = "";
  document.getElementById("final-stock-out").value = "";
  document.getElementById("output-type-list").value = "";
  document.getElementById("output-description").value = "";
}

function showStockInputFields() {
  document.getElementById('new-stock-input-fields').classList.remove('hidden');

  document.getElementById("new-stock-amount").disabled = false;  
}

function hideStockInputFields() {
  document.getElementById('new-stock-input-fields').classList.add('hidden');
  
  document.getElementById("new-stock-amount").disabled = true; 
}

function showStockOutputFields() {
  document.getElementById('new-stock-output-fields').classList.remove('hidden');

  document.getElementById("new-output-type-list").disabled = false;  
}

function hideStockOutputFields() {
  document.getElementById('new-stock-output-fields').classList.add('hidden');
  document.getElementById('new-stock-output-detail').classList.add('hidden');

  document.getElementById("new-output-type-list").disabled = true;
  document.getElementById("new-output-desc").disabled = true;
}

function showStockOutputDetail() {
  document.getElementById('new-stock-output-detail').classList.remove('hidden');

  document.getElementById("new-output-desc").disabled = false;
}

function hideStockOutputDetail() {
  document.getElementById('new-stock-output-detail').classList.add('hidden');

  document.getElementById("new-output-desc").disabled = true;
}

function hideStockFields() {
  blockNewQuantity();
  hideStockInputFields();
  hideStockOutputFields();
}

function clickOnInput() {
  clearNewStockFields();
  clearOutputFields();
}

function clickOnOutput() {
  clearNewStockFields();
  clearInputFields();
}

function clickOnNewStock() {
  clearOutputFields();
  clearInputFields();
}

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

function stopLoadingScreen() {
  document.getElementById('loading').classList.add('hide');
}

function startLoadingScreen() {
  document.getElementById('loading').classList.remove('hide');
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

function blockNewQuantity() {
  document.getElementById(NEW_QUANTITY_ID).disabled = true;
}

function unBlockNewQuantity() {  
  document.getElementById(NEW_QUANTITY_ID).disabled = false;
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