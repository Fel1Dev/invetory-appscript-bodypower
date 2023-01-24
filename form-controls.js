
/* Field definition */
const REACORD_DATE_ID = 'record-date';
const USER_LIST_ID = 'user-list';
const ITEM_LIST_ID = 'item-list';
const CURRENT_STOCK_ID = 'current-stock';
const NEW_QUANTITY_ID = 'new-quantity';

const OUTPUT_TYPE_BAJA = 'BAJA';

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

  function stopLoadingScreen() {
    document.getElementById('loading').classList.add('hide');
  }
  
  function startLoadingScreen() {
    document.getElementById('loading').classList.remove('hide');
  }

  function blockNewQuantity() {
    document.getElementById(NEW_QUANTITY_ID).disabled = true;
  }
  
  function unBlockNewQuantity() {  
    document.getElementById(NEW_QUANTITY_ID).disabled = false;
  }
  