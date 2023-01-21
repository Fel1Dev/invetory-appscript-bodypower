
document.getElementById('clear-fields').addEventListener("click", clearFields);
document.getElementById('create-record').addEventListener("click", createRecord);
window.addEventListener("load", startUpForm);

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
    option.text = item[1] + ", " + item[3];
    itemListInput.appendChild(option);
  });
  addListenerItemChange();
}

function loadItemsData() {
  google.script.run.withSuccessHandler( createItemsOptions ).getItemsData();
}

function createSimpleListsOptions( allListsData ) {
  console.table(allListsData);
  const usersListInput = document.getElementById('user-list-options');
  const unitsListInput = document.getElementById('unit-list-options');
  const newOutTypesListInput = document.getElementById('new-output-list-options');
  const outOutTypesListInput = document.getElementById('output-list-options');
  allListsData.forEach(dataRow => {
    console.log(dataRow);
    createListOption(unitsListInput, dataRow[0]);
    createListOption(usersListInput, dataRow[1]);
    createListOption(newOutTypesListInput, dataRow[3]);
    createListOption(outOutTypesListInput, dataRow[3]);
  });
  console.log('Final simple list');
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


function clearFields() {
    let keepDate = document.getElementById("keep-date").checked;
    let keepUserList = document.getElementById("keep-user-list").checked;

    if(!keepDate) {
        document.getElementById("record-date").value = "";
    }
    if(!keepUserList) {
        document.getElementById("user-list").value = "";
    }       
    // General fields
    document.getElementById("item-list").value = "";
    document.getElementById("current-stock").value = "";
    document.getElementById("unit-list").value = "";
    // New Stock
    document.getElementById("new-quantity").value = "";
    document.getElementById("final-stock-new").value = "";

    document.getElementById("new-stock-invoice").value = "";
    document.getElementById("new-stock-amount").value = "";

    document.getElementById("new-output-type-list").value = "";
    document.getElementById("new-output-desc").value = "";
    
    // Input
    document.getElementById("invoice").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("final-stock-input").value = "";
    
    // Output
    document.getElementById("out-quantity").value = "";
    document.getElementById("final-stock-out").value = "";
    document.getElementById("output-type-list").value = "";
    document.getElementById("output-description").value = "";

    initCurrDateField();
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

function addListenerItemChange() {
  document.getElementById('item-list').addEventListener('onChange', getCurrentStock );
}

function getCurrentStock() {
  //TODO
  const itemName = document.getElementById('item-list').getValue();
  console.log(itemName);
  //Call backed function to get only one row
  searchItemData(itemName)
}

function searchItemData( name ) {
  google.script.run.withSuccessHandler( processItemData ).getItemData(name);
}

function processItemData( itemData ) {
  let value = parseInt(itemData[6]);
  showCurrentStock(value);
}

function updateCurrentStock(value) {
  document.getElementById('current-stock').value = value;
}
