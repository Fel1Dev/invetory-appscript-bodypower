const HOME_LINK_ID = 'home-page';
const INVENTORY_PAGE_ID = 'inventory-form-page';
const REPORT_PAGE_ID = 'report-page';

document.getElementById('header-navbar').addEventListener('click', navbarClicked);
window.addEventListener('load', startUpMainPage);

function startUpMainPage() {
  getPageContent(HOME_LINK_ID);
}

function navbarClicked(e) {
  console.log(e.target.id);
  if (e.target.id !== 'header-navbar') {
    removeActiveLinks();
    activeNavbarLink(e.target.id);
    getPageContent(e.target.id);
  }
}

function removeActiveLinks() {
  document.getElementById(HOME_LINK_ID).classList.remove('active');
  document.getElementById(INVENTORY_PAGE_ID).classList.remove('active');
  document.getElementById(REPORT_PAGE_ID).classList.remove('active');
}

function activeNavbarLink(id) {
  document.getElementById(id).classList.add('active');
}

function getPageContent(pageId) {
  if ('undefined' !== typeof google) {
    google.script.run
      .withSuccessHandler(putHTMLContent)
      .withFailureHandler(failResponse)
      .getHTMLPageContent(pageId);
    return;
  }
}

function failResponse() {
  //redirect to home
  //infinite loop
  //getPageContent(HOME_LINK_ID);
}

function putHTMLContent(HTMLContent) {
  console.log(HTMLContent);
  document.getElementById('main-content').innerHTML = HTMLContent.content;
  loadPageEventsByName(HTMLContent.pageName);
}

function loadPageEventsByName(pageName) {
  console.log('pageName: ' + pageName);

  switch (pageName) {
    case HOME_LINK_ID:
      loadHomePage();
      break;
    case INVENTORY_PAGE_ID:
      loadRecordFormLogic();
      break;
    case CONFIGURATION_LINK_ID:
      loadConfigurationPage();
      break;
    case REPORT_PAGE_ID:
      loadReportPage();
      break;
  }
}

function loadRecordFormLogic() {
  /* Global events */
  startUpForm();
  document.getElementById('clear-fields').addEventListener('click', clearFields);
  document.getElementById('form-inventory').addEventListener('submit', dataValidation);

  /* Tab Panel events */
  document.getElementById(NEW_STOCK_TAB_ID).addEventListener('click', clickOnNewStock);
  document.getElementById(INPUT_TAB_ID).addEventListener('click', clickOnInput);
  document.getElementById(OUTPUT_TAB_ID).addEventListener('click', clickOnOutput);

  /* New Stock events */
  document.getElementById(ITEM_LIST_ID).addEventListener('change', getCurrentStock);
  document.getElementById(NEW_STOCK_ID).addEventListener('input', processNewStock);
  document.getElementById(STOCK_OUTPUT_TYPE_LIST).addEventListener('input', processStockOutputType);

  /* Input events */
  document.getElementById(QUANTITY_ID).addEventListener('input', processInQuantity);

  /*Output event */
  document.getElementById(OUT_QUANTITY_ID).addEventListener('input', processOutQuantity);
  document.getElementById(OUTPUT_TYPE_LIST).addEventListener('input', processOutputTypeList);
}

function loadConfigurationPage() {}

function loadReportPage() {}

function loadHomePage() {}
