const HOME_LINK_ID = 'home-page';
const INVENTORY_PAGE_ID = 'inventory-page';
const CONFIGURATION_LINK_ID = 'configuration-page';
const REPORT_PAGE_ID = 'report-page';

document.getElementById('header-navbar').addEventListener('click', navbarClicked);

function navbarClicked(e) {
  removeActiveLinks();
  activeNavbarLink(e.target.id);
  getPageContent(e.target.id);
}

function removeActiveLinks() {
  document.getElementById(HOME_LINK_ID).classList.remove('active');
  document.getElementById(INVENTORY_PAGE_ID).classList.remove('active');
  document.getElementById(CONFIGURATION_LINK_ID).classList.remove('active');
  document.getElementById(REPORT_PAGE_ID).classList.remove('active');
}

function activeNavbarLink(id) {
  document.getElementById(id).classList.add('active');
}

function getPageContent(pageId) {
  google.script.run
  .getHTMLPageContent(pageId);
}