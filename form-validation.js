function dataValidtation(event) {
  event.preventDefault();
  startLoadingScreen();
  let recordType = '';
  let formData = [];

  const stockDifference = parseInt(document.getElementById(DIFFERENCE_ID).value);
  const inputQuantity = document.getElementById(QUANTITY_ID).value;
  const outputQuantity = document.getElementById(OUT_QUANTITY_ID).value;

  if (inputQuantity) {
    console.log('----------input');
    recordType = ENTRADA_ROW_TYPE;
    formData = getFormDataAsInput();
  }

  if (outputQuantity) {
    console.log('----------output');
    recordType = SALIDA_ROW_TYPE;
    formData = getFormDataAsOutput();
  }

  if (stockDifference > 0) {
    console.log('----------Stock input');
    recordType = ENTRADA_ROW_TYPE;
    formData = getFormDataAsStockInput();
  }

  if (0 > stockDifference) {
    console.log('----------Stock output');
    recordType = SALIDA_ROW_TYPE;
    formData = getFormDataAsStockOutput();
  }
  console.log('recordType: ' + recordType);
  console.table(formData);
  google.script.run
    .withSuccessHandler(successResponse)
    .withFailureHandler(failResponse)
    .getFrontData(recordType, [formData]);
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

function getFormDataAsStockInput() {
  const userName = document.getElementById(USER_LIST_ID).value;
  const invoice = document.getElementById(STOCK_INVOICE_ID).value;
  const recordDate = document.getElementById(RECORD_DATE_ID).value;
  const productName = document.getElementById(ITEM_LIST_ID).value;
  const inputQuantity = document.getElementById(DIFFERENCE_ID).value;
  const amount = document.getElementById(STOCK_AMOUNT_ID).value;

  return ['', userName, invoice, recordDate, productName, inputQuantity, '', amount];
}

function getFormDataAsStockOutput() {
  const userName = document.getElementById(USER_LIST_ID).value;
  const recordDate = document.getElementById(RECORD_DATE_ID).value;
  const productName = document.getElementById(ITEM_LIST_ID).value;
  const outputQuantity = document.getElementById(DIFFERENCE_ID).value * -1;
  const outType = document.getElementById(STOCK_OUTPUT_TYPE_LIST).value;
  const outDesc = document.getElementById(STOCK_OUTPUT_DESC).value;

  return ['', userName, recordDate, productName, '', outputQuantity, outType, outDesc];
}

function successResponse() {
  console.log('Success response');
  clearFields();
  stopLoadingScreen();
}

function failResponse(event) {
  console.log('Fail response');
  console.log(event);
  stopLoadingScreen();
}
