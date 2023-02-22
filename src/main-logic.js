const HOME_PAGE_ID = 'home-page';
const INVENTORY_PAGE_ID = 'inventory-form-page';
const REPORT_PAGE_ID = 'report-page';

const INVENTORY_HOME_CARD_ID = 'inventory-card';
const REPORT_HOME_CARD_ID = 'report-card';

document.getElementById('header-navbar').addEventListener('click', navbarClicked);
document.getElementById('main-logo').addEventListener('click', redirecToHomePage);
window.addEventListener('load', startUpMainPage);

function startUpMainPage() {
  startLoadingScreen();
  getPageContent(HOME_PAGE_ID);
}

function navbarClicked(e) {
  const pageId = e.target.id;
  console.log('pageId: ' + pageId);
  if (pageId !== 'header-navbar') {
    activePageByName(pageId);
  }
}

function activePageByName(pageName) {
  startLoadingScreen();
  removeActiveLinks();
  activeNavbarLink(pageName);
  getPageContent(pageName);
}

function removeActiveLinks() {
  document.getElementById(HOME_PAGE_ID).classList.remove('active');
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
  stopLoadingScreen();
}

function putHTMLContent(HTMLContent) {
  document.getElementById('main-content').innerHTML = HTMLContent.content;
  loadPageEventsByName(HTMLContent.pageName);  
}

function loadPageEventsByName(pageName) {
  console.log('pageName: ' + pageName);

  switch (pageName) {
    case HOME_PAGE_ID:
      loadHomePage();
      break;
    case INVENTORY_PAGE_ID:
      loadRecordFormLogic();
      break;
    case REPORT_PAGE_ID:
      loadReportPage();
      break;
  }
}

function loadRecordFormLogic() {
  /* Global events */
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
  
  /* Output event */
  document.getElementById(OUT_QUANTITY_ID).addEventListener('input', processOutQuantity);
  document.getElementById(OUTPUT_TYPE_LIST).addEventListener('input', processOutputTypeList);
  startUpForm();
}

function loadReportPage() {
  document.getElementById('reload-button').addEventListener('click', reloadReport);
  reloadReport();
}

function loadHomePage() {
  console.log('rendering HomePage....');
  document.getElementById(INVENTORY_HOME_CARD_ID).addEventListener('click', redirectToInventory);
  document.getElementById(REPORT_HOME_CARD_ID).addEventListener('click', redirectToReportPage);
  stopLoadingScreen();
}

function redirectToReportPage() {
  console.log('rendering ReportPage....');
  activePageByName(REPORT_PAGE_ID);
}

function redirectToInventory() {
  console.log('rendering InventoryPage....');
  activePageByName(INVENTORY_PAGE_ID);
}

function redirecToHomePage() {
  console.log('rendering HomePage....');
  activePageByName(HOME_PAGE_ID);
}
