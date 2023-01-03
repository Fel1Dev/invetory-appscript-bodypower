
document.getElementById('clear-fields').addEventListener("click", clearFields);

function clearFields() {
    let keepDate = document.getElementById("keep-date").checked;
    let keepUserList = document.getElementById("keep-user-list").checked;

    
    document.getElementById("record-date").value = "";
    document.getElementById("user-list").value = "";
    document.getElementById("record-date").value = "";
    document.getElementById("record-date").value = "";
    document.getElementById("record-date").value = "";
}