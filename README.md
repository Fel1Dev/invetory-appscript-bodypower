

# Inventory Manager integrated with Google spreadsheet 

AppScript web application to support a daily inventory system.

## Google integration details 
This web app is integrated with 4 Google spreadsheets.
The first one, Inventory has the item information like the initial stock, out sum, in sum and operation to get the current stock (initial stock + inputs - outputs)

There are two more sheets with inputs and outputs records.

Finally, one sheet with data to fill some lists like name of users, units, status of stock level, etc.

## Installation 
This is a vanilla JavaScript web app, you just need to open the index.html file to view the main menu.
 

## Web UI testing
To test all web features and interactions we are using Jest framework and JsDom library to emulate all application pages including a it’s JS and CSS files.

Install dependencies to do run test cases:
```npm install```

To run all test suites:
```npm test```




