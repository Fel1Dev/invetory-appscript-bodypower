
document.getElementById('clear-fields').addEventListener("click", clearFields);
document.getElementById('create-record').addEventListener("click", createRecord);
window.addEventListener("load", startUpForm);

    function startUpForm() {
      //set currentDate with timezone
      document.getElementById('record-date').value = getLocalDateAsValue();

      //Initialize lists
      loadItemData();
    }

    function getLocalDateAsValue() {
      let local = new Date();
      local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
      return local.toJSON().slice(0,10);
    }

    function loadItems( itemsData ) {
      console.log('loadItems');
      const itemListInput = document.getElementById('item-list-options');
      itemsData.forEach(item => {
        const option = document.createElement('option');
        option.value = item[1];
        option.text = item[1] + ", " + item[3];
        itemListInput.appendChild(option);
      });
    }

    function loadItemData() {
      console.log('DataList ItemData');
      google.script.run.withSuccessHandler( loadItems ).getItemsData();
    }


function clearFields() {
    let keepDate = document.getElementById("keep-date").checked;
    let keepUserList = document.getElementById("keep-user-list").checked;

    if(!keepDate) {
        document.getElementById("record-date").value = "";
    }
    if(!keepUserList) {
        document.getElementById("user-list").value = "";
    }       
    // General fields
    document.getElementById("item-list").value = "";
    document.getElementById("current-stock").value = "";
    document.getElementById("units").value = "";
    // New Stock
    document.getElementById("new-quantity").value = "";
    document.getElementById("final-stock-new").value = "";

    document.getElementById("new-stock-invoice").value = "";
    document.getElementById("new-stock-amount").value = "";

    document.getElementById("new-output-type").value = "";
    document.getElementById("new-output-desc").value = "";
    
    // Input
    document.getElementById("invoice").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("final-stock-input").value = "";
    
    // Output
    document.getElementById("output-type").value = "";
    document.getElementById("out-quantity").value = "";
    document.getElementById("final-stock-out").value = "";
    document.getElementById("output-description").value = "";

    startUpForm();
}

function createRecord() {
  //read fields
  console.log('create record');
    
}