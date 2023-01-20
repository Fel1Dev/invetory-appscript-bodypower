
document.getElementById('clear-fields').addEventListener("click", clearFields);
document.getElementById('create-record').addEventListener("click", createRecord);
window.addEventListener("load", startUpForm);

function startUpForm() {
  //set currentDate with timezone
  document.getElementById('record-date').value = getLocalDateAsValue();

  //Initialize lists
  //loadItemData();
  //loadUserData();
  

  //Jerry

  //Las demas
  let jerry = [
    'PARTYCLASSIFICATIONASSOCIATION',
'PARTYCONTRACTVERSION',
'PARTYIDENTIFIER',
'PARTYPARENTCOMPANYDETAIL',
'PARTYPOSTALADDRESS',
'UTILITYGROUP',
'UTILITYPORDISCOUNTHISTORY',
'UTILITYSALESTERRITORY',
'UTILITYTRANSMISSIONRATE',
  ]

  let otros = [
    'PARTY',
'PARTYCALENDARASSOCIATION',
'PARTYCONTACTMECHANISM',
'PARTYCONTACTMECHANISMLINK',
'PARTYCREDITRATING',
'PARTYHISTORY',
'PARTYPARENTACCOUNT',
'PARTYPARENTCOMPANYADDRESS',
'PARTYPARENTCVASSOCIATION',
'PARTYPAYMENTACCOUNT',
'PARTYRELATIONSHIP',
'PARTYROLE',
'UTILITYPERHOUR',
'UTILITYPORDISCOUNT',
'UTILITYPRICINGCOMPONENT',
'UTILITYPTC',
'UTILITYSTATEASSOCIATION',
'UTILITYTERRITORY',
  ];

  let all = [
    'PARTY',
'PARTYCALENDARASSOCIATION',
'PARTYCLASSIFICATIONASSOCIATION',
'PARTYCONTACTMECHANISM',
'PARTYCONTACTMECHANISMLINK',
'PARTYCONTRACTVERSION',
'PARTYCREDITRATING',
'PARTYHISTORY',
'PARTYIDENTIFIER',
'PARTYPARENTACCOUNT',
'PARTYPARENTCOMPANYADDRESS',
'PARTYPARENTCOMPANYDETAIL',
'PARTYPARENTCVASSOCIATION',
'PARTYPAYMENTACCOUNT',
'PARTYPOSTALADDRESS',
'PARTYRELATIONSHIP',
'PARTYROLE',
'UTILITYGROUP',
'UTILITYPERHOUR',
'UTILITYPORDISCOUNT',
'UTILITYPORDISCOUNTHISTORY',
'UTILITYPRICINGCOMPONENT',
'UTILITYPTC',
'UTILITYSALESTERRITORY',
'UTILITYSTATEASSOCIATION',
'UTILITYTERRITORY',
'UTILITYTRANSMISSIONRATE',
  ]

  let result = "";

  all.forEach(table => {
    let tempalteSql = `DROP TABLE if exists importnextstar.${table};  
CREATE TABLE importnextstar.${table} 
USING parquet
LOCATION "wasbs://nextstar@stgbillingpoc.blob.core.windows.net/parquet-nextstar-raw/${table.toLowerCase()}";

`;

    let templatePanda = `${table} = sqlContext.sql("select * from importnextstar.${table}")
${table}_pandas_df = ps.DataFrame(${table})
${table}_pandas_df_unique = ps.DataFrame(${table}_pandas_df.nunique())
${table}_pandas_df_na = ps.DataFrame(${table}_pandas_df.isna().sum())
${table}_pandas_df_unique.reset_index(inplace=True)
${table}_pandas_df_na.reset_index(inplace=True)
${table}_results = ${table}_pandas_df_unique.merge(${table}_pandas_df_na, on='index')
${table}_results.rename({'index': 'Colname', 'None_x': 'Uniquevals', 'None_y': 'Nullvals'}, axis=1, inplace=True)

`;
    
    result += templatePanda;
  });
  
  console.log(result);
; 
}

function getLocalDateAsValue() {
  let local = new Date();
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
  return local.toJSON().slice(0,10);
}

function loadItemList( itemsData ) {
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
  google.script.run.withSuccessHandler( loadItemList ).getItemsData();
}

function loadUserList( usersData ) {
  console.log('loadItems');
  console.table(usersData);
  const usersListInput = document.getElementById('user-list-options');
  const unitsListInput = document.getElementById('unit-list-options');
  const newOutTypesListInput = document.getElementById('new-output-list-options');
  const outOutTypesListInput = document.getElementById('output-list-options');
  usersData.forEach(user => {
    const option = document.createElement('option');
    option.value = user[1];
    option.text = user[1];
    usersListInput.appendChild(option);
  });
}

function loadUserData() {
  google.script.run.withSuccessHandler( loadUserList ).getUsersData();
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
    document.getElementById("unit-list").value = "";
    // New Stock
    document.getElementById("new-quantity").value = "";
    document.getElementById("final-stock-new").value = "";

    document.getElementById("new-stock-invoice").value = "";
    document.getElementById("new-stock-amount").value = "";

    document.getElementById("new-output-type-list").value = "";
    document.getElementById("new-output-desc").value = "";
    
    // Input
    document.getElementById("invoice").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("final-stock-input").value = "";
    
    // Output
    document.getElementById("out-quantity").value = "";
    document.getElementById("final-stock-out").value = "";
    document.getElementById("output-type-list").value = "";
    document.getElementById("output-description").value = "";

    startUpForm();
}

function createRecord() {
  //read fields
  console.log('create record');
    
}