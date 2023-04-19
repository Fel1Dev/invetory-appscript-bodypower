function createRecord(event) {
  event.preventDefault();
  startLoadingScreen();

  const formData = saveFormDataOnSpreadSheet();
  updateLowStockSince(formData.finalStock);

  clearFields();
  stopLoadingScreen();
}

function saveFormDataOnSpreadSheet() {
  const formData = collectFormDataToSend();
  sendDataToSpreadSheet(formData.data, formData.recordType);
  return formData.data;
}

function updateLowStockSince(finalStock) {
  const minStock = getCurrentMinStock();
  const lowStockSinceDate = getCurrentLowStockSince();
  const itemName = document.getElementById(ITEM_LIST_ID).value;

  if (lowStockSinceDate && finalStock > minStock) {
    updateLowStockSinceDate(itemName, '');
  }
  if (!lowStockSinceDate && finalStock < minStock) {
    updateLowStockSinceDate(itemName, getDataTimeAsString());
  }
}

function getDataTimeAsString() {
  let lowStockSince = new Date();
  lowStockSince.setMinutes(lowStockSince.getMinutes() - lowStockSince.getTimezoneOffset());
  return lowStockSince.toJSON().replace('T', ' ').split('.')[0];
}

function updateLowStockSinceDate(itemName, sinceDate) {
  if ('undefined' !== typeof google) {
    google.script.run
      .withFailureHandler(failResponse)
      .updateInventorySinceDate(itemName, sinceDate);
  }
}

function sendDataToSpreadSheet(data, recordType) {
  if ('undefined' !== typeof google) {
    google.script.run
      .withSuccessHandler(saveRecordSucessResponse)
      .withFailureHandler(failResponse)
      .saveFormData(recordType, [data]);

    setTimeout(() => {
      stopLoadingScreen();
      clearFields();
    }, 500);
  }
}

function collectFormDataToSend() {
  let recordType = '';
  let formData = [];
  let finalStock = null;

  const stockDifference = parseInt(document.getElementById(DIFFERENCE_ID).value);
  const inputQuantity = document.getElementById(QUANTITY_ID).value;
  const outputQuantity = document.getElementById(OUT_QUANTITY_ID).value;

  if (inputQuantity) {
    recordType = ENTRADA_ROW_TYPE;
    formData = getFormDataAsInput();
    finalStock = document.getElementById(FINAL_STOCK_INPUT_ID).value;
  }

  if (outputQuantity) {
    recordType = SALIDA_ROW_TYPE;
    formData = getFormDataAsOutput();
    finalStock = document.getElementById(FINAL_STOCK_OUT_ID).value;
  }

  if (stockDifference > 0) {
    recordType = ENTRADA_ROW_TYPE;
    formData = getFormDataAsStockInput();
    finalStock = document.getElementById(NEW_STOCK_ID).value;
  }

  if (0 > stockDifference) {
    recordType = SALIDA_ROW_TYPE;
    formData = getFormDataAsStockOutput();
    finalStock = document.getElementById(NEW_STOCK_ID).value;
  }

  console.log('recordType: ' + recordType);
  console.table(formData);

  return { data: formData, recordType: recordType, finalStock: finalStock };
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
    recordDate: formatDate2(document.getElementById(RECORD_DATE_ID).value),
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
      padTo2Digits(recordDate.getDate() + 1),
      padTo2Digits(recordDate.getMonth() + 1),
      recordDate.getFullYear(),
    ].join('/');
};

const formatDate2 = (dateText) => {
  console.log('dateText: ' + dateText);
  if (dateText) {
    const splitedDate = dateText.split('-');
    const finalDate = `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`;
    console.log(`Final date: '${finalDate}`);
    return finalDate;
  }
};

function saveRecordSucessResponse() {
  console.log('Success response');
  clearFields();
  loadItemsData();
}

function failResponse(event) {
  console.log('Fail response');
  console.log(event);
  stopLoadingScreen();
}
