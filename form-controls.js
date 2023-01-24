
/* Field definition */
const RECORD_DATE_ID = 'record-date';
const USER_LIST_ID = 'user-list';
const ITEM_LIST_ID = 'item-list';
const CURRENT_STOCK_ID = 'current-stock';

/* New Stock tab */
const NEW_STOCK_ID = 'new-stock';
const DIFFERENCE_ID = 'difference';
const STOCK_INVOICE_ID = 'stock-invoice';
const STOCK_AMOUNT_ID = 'stock-amount';

const STOCK_OUTPUT_TYPE_LIST = 'stock-output-type-list';
const STOCK_OUTPUT_DESC = 'new-output-desc';

/* Input Tab */
const INVOICE_ID = 'invoice';
const AMOUNT_ID = 'amount';
const QUANTITY_ID = 'quantity';
const FINAL_STOCK_INPUT_ID = 'final-stock-input';

/* Output Tab */
const OUT_QUANTITY_ID = 'out-quantity';
const FINAL_STOCK_OUT = 'final-stock-out';
const OUTPUT_TYPE_LIST = 'output-type-list';
const OUTPUT_DESC = 'output-description';


const OUTPUT_TYPE_BAJA = 'BAJA';

function clearFields() {
    let keepDate = document.getElementById("keep-date").checked;
    let keepUserList = document.getElementById("keep-user-list").checked;
  
    if(!keepDate) {
        document.getElementById(RECORD_DATE_ID).value = "";
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
    document.getElementById(NEW_STOCK_ID).value = "";
    document.getElementById(DIFFERENCE_ID).value = "";
  
    document.getElementById(STOCK_INVOICE_ID).value = "";
    document.getElementById(STOCK_AMOUNT_ID).value = "";
  
    document.getElementById(STOCK_OUTPUT_TYPE_LIST).value = "";
    document.getElementById(STOCK_OUTPUT_DESC).value = "";
  
    hideStockFields();
  }
  
  function clearInputFields() {
    // Input
    document.getElementById(INVOICE_ID).value = "";
    document.getElementById(AMOUNT_ID).value = "";
    document.getElementById(QUANTITY_ID).value = "";
    document.getElementById(FINAL_STOCK_INPUT_ID).value = "";
  }
  
  function clearOutputFields() {
    // Output
    document.getElementById(OUT_QUANTITY_ID).value = "";
    document.getElementById(FINAL_STOCK_OUT).value = "";
    document.getElementById(OUTPUT_TYPE_LIST).value = "";
    document.getElementById(OUTPUT_DESC).value = "";
  }
  
  function showStockInputFields() {
    document.getElementById('new-stock-input-fields').classList.remove('hidden');
        
    document.getElementById(STOCK_AMOUNT_ID).disabled = false;
  }
  
  function hideStockInputFields() {
    document.getElementById('new-stock-input-fields').classList.add('hidden');
    
    document.getElementById(STOCK_AMOUNT_ID).disabled = true;
  }
  
  function showStockOutputFields() {
    document.getElementById('new-stock-output-fields').classList.remove('hidden');
  
    document.getElementById(STOCK_OUTPUT_TYPE_LIST).disabled = false;  
  }
  
  function hideStockOutputFields() {
    document.getElementById('new-stock-output-fields').classList.add('hidden');
    document.getElementById('new-stock-output-detail').classList.add('hidden');
  
    document.getElementById(STOCK_OUTPUT_TYPE_LIST).disabled = true;
    document.getElementById(STOCK_OUTPUT_DESC).disabled = true;
  }
  
  function showStockOutputDetail() {
    document.getElementById('new-stock-output-detail').classList.remove('hidden');
  
    document.getElementById(STOCK_OUTPUT_DESC).disabled = false;
  }
  
  function hideStockOutputDetail() {
    document.getElementById('new-stock-output-detail').classList.add('hidden');
  
    document.getElementById(STOCK_OUTPUT_DESC).disabled = true;
  }

  function showStockInputFields() {
    document.getElementById(INVOICE_ID).disabled = false;
    document.getElementById(AMOUNT_ID).disabled = false;
    document.getElementById(QUANTITY_ID).disabled = false;
  }

  function hideStockInputFields() {
    document.getElementById(INVOICE_ID).disabled = true;
    document.getElementById(AMOUNT_ID).disabled = true;
    document.getElementById(QUANTITY_ID).disabled = true;
  }

  function hideStockFields() {
    blockNewQuantity();
    hideStockInputFields();
    hideStockOutputFields();
  }
  
  function clickOnInput() {
    clearNewStockFields();
    clearOutputFields();
    showStockInputFields();
  }
  
  function clickOnOutput() {
    clearNewStockFields();
    clearInputFields();
  }
  
  function clickOnNewStock() {
    clearOutputFields();
    clearInputFields();

    const currStock = document.getElementById(CURRENT_STOCK_ID).value;
    if(currStock) {
      unBlockNewStock();
    }
  }

  function stopLoadingScreen() {
    document.getElementById('loading').classList.add('hide');
  }
  
  function startLoadingScreen() {
    document.getElementById('loading').classList.remove('hide');
  }

  function blockNewQuantity() {
    document.getElementById(NEW_STOCK_ID).disabled = true;
  }
  
  function unBlockNewStock() {  
    document.getElementById(NEW_STOCK_ID).disabled = false;
  }
  