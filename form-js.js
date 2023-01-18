
document.getElementById('clear-fields').addEventListener("click", clearFields);
document.getElementById('create-record').addEventListener("click", createRecord);

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
    document.getElementById("product").value = "";
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
}

function createRecord() {
    
    //read fields
    
}

function loadItemData(itemsData) {

}