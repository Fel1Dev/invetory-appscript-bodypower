/* Field definition */
const RECORD_DATE_ID = 'record-date';
const USER_LIST_ID = 'user-list';
const ITEM_LIST_ID = 'item-list';
const CURRENT_STOCK_ID = 'current-stock';
const CURRENT_UNIT_ID = 'current-unit';
const ITEM_ERROR_LABEL_ID = 'item-error-label';

/* New Stock tab */
const NEW_STOCK_TAB_ID = 'new-stock-tab';
const NEW_STOCK_ID = 'new-stock';
const DIFFERENCE_ID = 'difference';
const STOCK_INVOICE_ID = 'stock-invoice';
const STOCK_AMOUNT_ID = 'stock-amount';

const STOCK_OUTPUT_TYPE_LIST = 'stock-output-type-list';
const STOCK_OUTPUT_DESC = 'new-output-desc';

/* Input Tab */
const INPUT_TAB_ID = 'input-tab';
const INVOICE_ID = 'invoice';
const AMOUNT_ID = 'amount';
const QUANTITY_ID = 'quantity';
const FINAL_STOCK_INPUT_ID = 'final-stock-input';

/* Output Tab */
const OUTPUT_TAB_ID = 'output-tab';
const OUT_QUANTITY_ID = 'out-quantity';
const FINAL_STOCK_OUT_ID = 'final-stock-out';
const OUTPUT_TYPE_LIST = 'output-type-list';
const OUTPUT_DESC = 'output-description';

/* Important values */
const OUTPUT_TYPE_BAJA = 'BAJA';
const ENTRADA_ROW_TYPE = 'ENTRADA';
const SALIDA_ROW_TYPE = 'SALIDA';

const CSS_HIDE_CLASS = 'hidden';

function clearFields() {
  let keepDate = document.getElementById('keep-date').checked;
  let keepUserList = document.getElementById('keep-user-list').checked;

  if (!keepDate) {
    document.getElementById(RECORD_DATE_ID).value = '';
  }
  if (!keepUserList) {
    document.getElementById(USER_LIST_ID).value = '';
  }
  // General fields
  document.getElementById(ITEM_LIST_ID).value = '';
  document.getElementById(CURRENT_STOCK_ID).value = '';
  document.getElementById(CURRENT_UNIT_ID).value = '';

  // New Stock
  if (isTabActive(NEW_STOCK_TAB_ID)) {
    clearNewStockFields();
    hideStockFields();
  }

  // Input
  if (isTabActive(INPUT_TAB_ID)) {
    clearInputFields();
    disableInputFields();
  }

  // Output
  if (isTabActive(OUTPUT_TAB_ID)) {
    clearOutputFields();
    disableOutputFields();
  }
}

function clearNewStockFields() {
  // New Stock
  document.getElementById(NEW_STOCK_ID).value = '';
  document.getElementById(DIFFERENCE_ID).value = '';

  document.getElementById(STOCK_INVOICE_ID).value = '';
  document.getElementById(STOCK_AMOUNT_ID).value = '';

  document.getElementById(STOCK_OUTPUT_TYPE_LIST).value = '';
  document.getElementById(STOCK_OUTPUT_DESC).value = '';
}

function clearInputFields() {
  // Input
  document.getElementById(INVOICE_ID).value = '';
  document.getElementById(AMOUNT_ID).value = '';
  document.getElementById(QUANTITY_ID).value = '';
  document.getElementById(FINAL_STOCK_INPUT_ID).value = '';
}

function clearOutputFields() {
  // Output
  document.getElementById(OUT_QUANTITY_ID).value = '';
  document.getElementById(FINAL_STOCK_OUT_ID).value = '';
  document.getElementById(OUTPUT_TYPE_LIST).value = '';
  document.getElementById(OUTPUT_DESC).value = '';
}

function clearStockInputFields() {
  document.getElementById(STOCK_INVOICE_ID).value = '';
  document.getElementById(STOCK_AMOUNT_ID).value = '';
}

function clearStockOutputFields() {
  document.getElementById(STOCK_OUTPUT_TYPE_LIST).value = '';
  document.getElementById(STOCK_OUTPUT_DESC).value = '';
}

function showStockInputFields() {
  document.getElementById('new-stock-input-fields').classList.remove(CSS_HIDE_CLASS);

  document.getElementById(STOCK_AMOUNT_ID).disabled = false;
  clearStockInputFields();
}

function hideStockInputFields() {
  document.getElementById('new-stock-input-fields').classList.add(CSS_HIDE_CLASS);

  document.getElementById(STOCK_AMOUNT_ID).disabled = true;
}

function showStockOutputFields() {
  document.getElementById('new-stock-output-fields').classList.remove(CSS_HIDE_CLASS);

  document.getElementById(STOCK_OUTPUT_TYPE_LIST).disabled = false;
  clearStockOutputFields();
}

function hideStockOutputFields() {
  document.getElementById('new-stock-output-fields').classList.add(CSS_HIDE_CLASS);
  document.getElementById('new-stock-output-detail').classList.add(CSS_HIDE_CLASS);

  document.getElementById(STOCK_OUTPUT_TYPE_LIST).disabled = true;
  document.getElementById(STOCK_OUTPUT_DESC).disabled = true;
}

function showStockOutputDetail() {
  document.getElementById('new-stock-output-detail').classList.remove(CSS_HIDE_CLASS);

  document.getElementById(STOCK_OUTPUT_DESC).disabled = false;
}

function hideStockOutputDetail() {
  document.getElementById('new-stock-output-detail').classList.add(CSS_HIDE_CLASS);

  document.getElementById(STOCK_OUTPUT_DESC).disabled = true;
}

function showOutputDetail() {
  document.getElementById('output-detail').classList.remove(CSS_HIDE_CLASS);

  document.getElementById(OUTPUT_DESC).disabled = false;
}

function hideOutputDetail() {
  document.getElementById('output-detail').classList.add(CSS_HIDE_CLASS);

  document.getElementById(OUTPUT_DESC).disabled = true;
}

function enableInputFields() {
  document.getElementById(INVOICE_ID).disabled = false;
  document.getElementById(AMOUNT_ID).disabled = false;
  document.getElementById(QUANTITY_ID).disabled = false;
}

function enableInputFieldsIfActive() {
  if (isTabActive(INPUT_TAB_ID)) {
    enableInputFields();
  }
}

function enableInputFieldsIfItem() {
  if (getCurrentStockValue()) {
    enableInputFields();
  }
}

function disableInputFields() {
  document.getElementById(INVOICE_ID).disabled = true;
  document.getElementById(AMOUNT_ID).disabled = true;
  document.getElementById(QUANTITY_ID).disabled = true;
}

function enableOutputFields() {
  document.getElementById(OUT_QUANTITY_ID).disabled = false;
  document.getElementById(OUTPUT_TYPE_LIST).disabled = false;
}

function enableOutputFieldsIfActive() {
  if (isTabActive(OUTPUT_TAB_ID)) {
    enableOutputFields();
  }
}

function enableOutputFieldsIfItem() {
  if (getCurrentStockValue()) {
    enableOutputFields();
  }
}

function disableOutputFields() {
  document.getElementById(OUT_QUANTITY_ID).disabled = true;
  document.getElementById(OUTPUT_TYPE_LIST).disabled = true;
  document.getElementById(OUTPUT_DESC).disabled = true;
}

function hideStockFields() {
  lockNewStock();
  hideStockInputFields();
  hideStockOutputFields();
}

function clickOnInput() {
  clearNewStockFields();
  hideStockFields();

  clearOutputFields();
  disableOutputFields();
  hideOutputDetail();

  enableInputFieldsIfItem();
}

function clickOnOutput() {
  clearNewStockFields();
  hideStockFields();

  clearInputFields();
  disableInputFields();

  enableOutputFieldsIfItem();
}

function clickOnNewStock() {
  clearOutputFields();
  hideOutputDetail();
  disableOutputFields();

  clearInputFields();
  disableInputFields();

  unlockNewStockIfItem();
}

function stopLoadingScreen() {
  document.getElementById('loading').classList.add('hide');
}

function startLoadingScreen() {
  document.getElementById('loading').classList.remove('hide');
}

function lockNewStock() {
  document.getElementById(NEW_STOCK_ID).disabled = true;
}

function unlockNewStockField() {
  document.getElementById(NEW_STOCK_ID).disabled = false;
}

function unlockNewStockIfItem() {
  if (getCurrentStockValue()) {
    unlockNewStockField();
  }
}

function unlockNewStockIfActive() {
  if (isTabActive(NEW_STOCK_TAB_ID)) {
    unlockNewStockField();
  }
}

const isTabActive = (tabId) => {
  const tab = document.getElementById(tabId);
  return tab.classList.contains('active');
};
