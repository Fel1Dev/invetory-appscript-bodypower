/* Events */
//document.getElementById('reload-button').addEventListener('click', reloadReport);

function reloadReport() {
  startLoadingScreen();
  getReportData();
}

function getReportData() {
  if ('undefined' !== typeof google) {
    google.script.run
      .withSuccessHandler(addContentToTable)
      .withFailureHandler(failResponse)
      .getInventoryData();
    return;
  }
  stopLoadingScreen();
}

function addContentToTable(dataFromInventory) {
    processResponse();
    renderResponse();
}

function failResponse() {
    errorResponse();
    stopLoadingScreen();
}

