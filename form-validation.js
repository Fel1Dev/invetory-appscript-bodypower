function dataValidtation(event) {
  event.preventDefault();
  startLoadingScreen();
  let recordType = '';
  let formData = [];

  const stockDifference = parseInt(document.getElementById(DIFFERENCE_ID).value);
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

  if (stockDifference > 0) {
    recordType = ENTRADA_ROW_TYPE;
    formData = getFormDataAsStockInput();
  }

  if (0 > stockDifference) {
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
  const { userName, recordDate, productName } = getCommonFields();
  const invoice = document.getElementById(INVOICE_ID).value;
  const inputQuantity = document.getElementById(QUANTITY_ID).value;
  const amount = document.getElementById(AMOUNT_ID).value;

  return ['', userName, invoice, recordDate, productName, inputQuantity, '', amount];
}

function getFormDataAsOutput() {
  const { userName, recordDate, productName } = getCommonFields();
  const outputQuantity = document.getElementById(OUT_QUANTITY_ID).value;
  const outType = document.getElementById(OUTPUT_TYPE_LIST).value;
  const outDesc = document.getElementById(OUTPUT_DESC).value;

  return ['', userName, recordDate, productName, '', outputQuantity, outType, outDesc];
}

function getFormDataAsStockInput() {
  const { userName, recordDate, productName } = getCommonFields();
  const invoice = document.getElementById(STOCK_INVOICE_ID).value;
  const inputQuantity = document.getElementById(DIFFERENCE_ID).value;
  const amount = document.getElementById(STOCK_AMOUNT_ID).value;

  return ['', userName, invoice, recordDate, productName, inputQuantity, '', amount];
}

function getFormDataAsStockOutput() {
  const { userName, recordDate, productName } = getCommonFields();
  const outputQuantity = document.getElementById(DIFFERENCE_ID).value * -1;
  const outType = document.getElementById(STOCK_OUTPUT_TYPE_LIST).value;
  const outDesc = document.getElementById(STOCK_OUTPUT_DESC).value;

  return ['', userName, recordDate, productName, '', outputQuantity, outType, outDesc];
}

const getCommonFields = () => {
  return {
    userName: document.getElementById(USER_LIST_ID).value,
    recordDate: formatDate(document.getElementById(RECORD_DATE_ID).value),
    productName: document.getElementById(ITEM_LIST_ID).value,
  };
};

const padTo2Digits = (num) => {
  return num.toString().padStart(2, '0');
};

const formatDate = (dateText) => {
  const recordDate = new Date(dateText);
  if (recordDate)
    return [
      padTo2Digits(recordDate.getDate()),
      padTo2Digits(recordDate.getMonth() + 1),
      recordDate.getFullYear(),
    ].join('/');
};

function successResponse() {
  console.log('Success response');
  clearFields();
  loadItemsDataStopLoader();
}

function failResponse(event) {
  console.log('Fail response');
  console.log(event);
  stopLoadingScreen();
}
