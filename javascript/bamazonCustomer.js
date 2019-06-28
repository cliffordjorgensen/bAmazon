var inquirer = require('inquirer');
var mysql = require("mysql");
const cTable = require('console.table')
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_DB"
});
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    runSearch();
});

function runSearch() {
    inquirer.prompt([{
        type: 'list',
        message: '\n\tPlease pick a menu open: \n\n',
        choices: [
            "\t* View Products for Sale",
            "\t* View Low Inventory",
            "\t* Add to Inventory",
            "\t* Add New Product",
            "\t* Exit"
        ],
        name: "action"
    }]).then(function(answer) {
        switch (answer.action) {
            case "\t* View Products for Sale":
                viewProducts();
                break;
            case "\t* View Low Inventory":
                viewLowInv();
                break;
            case "\t* Add to Inventory":
                addToInv();
                break;
            case "\t* Add New Product":
                addNewProd();
                break;
            case "Exit":
                connection.end();
                break;
        };
    });
};
const addNewProd = function() {
    console.log("\n\tInserting a new product...\n");
    inquirer.prompt([{
        type: "input",
        message: "enter the name of the new product.",
        name: "newItemName"
    }, {
        type: "input",
        message: "Enter department name for new item.",
        name: "newDeptName"
    }, {
        type: "input",
        message: "Enter price of new item",
        name: "newItemPrice"
    }, {
        type: "input",
        message: "How many new items will be stocked?",
        name: "newStockVal"
    }]).then(function(response) {
        console.log(response);
        connection.query(
            "INSERT INTO products SET ?", {
                product_name: response.newItemName,
                department_name: response.newDeptName,
                price: response.newItemPrice,
                stock_quantity: response.newStockVal
            },
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + "\n\tProduct inserted!\n");
                runSearch();
            })
    })


};

const viewProducts = function() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    });
};
const viewLowInv = function() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        lowInventory = [];
        for (let i = 0; i < res.length; i++) {
            if (res[i].stock_quantity <= 5) {
                lowInventory.push(res[i]);
            }
        }
        console.table(lowInventory);
        runSearch();
    });
};
const addToInv = function() {

};






// var mysql = require("mysql");
// var inquirer = require("inquirer");
// ​
// var connection = mysql.createConnection({
//  host: "localhost",
// ​
//  // Your port; if not 3306
//  port: 3306,
// ​
//  // Your username
//  user: "root",
// ​
//  // Your password
//  password: "",
//  database: "top_songsDB"
// });
// ​
// connection.connect(function(err) {
//  if (err) throw err;
//  runSearch();
// });
// ​
// function runSearch() {
//  inquirer
//   .prompt({
//    name: "action",
//    type: "list",
//    message: "What would you like to do?",
//    choices: [
//     "Find songs by artist",
//     "Find all artists who appear more than once",
//     "Find data within a specific range",
//     "Search for a specific song",
//     "exit"
//    ]
//   })
//   .then(function(answer) {
//    switch (answer.action) {
//    case "Find songs by artist":
//     artistSearch();
//     break;
// ​
//    case "Find all artists who appear more than once":
//     multiSearch();
//     break;
// ​
//    case "Find data within a specific range":
//     rangeSearch();
//     break;
// ​
//    case "Search for a specific song":
//     songSearch();
//     break;
// ​
//    case "exit":
//     connection.end();
//     break;
//    }
//   });
// }
// ​
// function artistSearch() {
//  inquirer
//   .prompt({
//    name: "artist",
//    type: "input",
//    message: "What artist would you like to search for?"
//   })
//   .then(function(answer) {
//    var query = "SELECT position, song, year FROM top5000 WHERE ?";
//    connection.query(query, { artist: answer.artist }, function(err, res) {
//     if (err) throw err;
//     for (var i = 0; i < res.length; i++) {
//      console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
//     }
//     runSearch();
//    });
//   });
// }
// ​
// function multiSearch() {
//  var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
//  connection.query(query, function(err, res) {
//   if (err) throw err;
//   for (var i = 0; i < res.length; i++) {
//    console.log(res[i].artist);
//   }
//   runSearch();
//  });
// }
// ​
// function rangeSearch() {
//  inquirer
//   .prompt([
//    {
//     name: "start",
//     type: "input",
//     message: "Enter starting position: ",
//     validate: function(value) {
//      if (isNaN(value) === false) {
//       return true;
//      }
//      return false;
//     }
//    },
//    {
//     name: "end",
//     type: "input",
//     message: "Enter ending position: ",
//     validate: function(value) {
//      if (isNaN(value) === false) {
//       return true;
//      }
//      return false;
//     }
//    }
//   ])
//   .then(function(answer) {
//    var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
//    connection.query(query, [answer.start, answer.end], function(err, res) {
//     if (err) throw err;
//     for (var i = 0; i < res.length; i++) {
//      console.log(
//       "Position: " +
//        res[i].position +
//        " || Song: " +
//        res[i].song +
//        " || Artist: " +
//        res[i].artist +
//        " || Year: " +
//        res[i].year
//      );
//     }
//     runSearch();
//    });
//   });
// }
// ​
// function songSearch() {
//  inquirer
//   .prompt({
//    name: "song",
//    type: "input",
//    message: "What song would you like to look for?"
//   })
//   .then(function(answer) {
//    console.log(answer.song);
//    connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
//     if (err) throw err;
//     console.log(
//      "Position: " +
//       res[0].position +
//       " || Song: " +
//       res[0].song +
//       " || Artist: " +
//       res[0].artist +
//       " || Year: " +
//       res[0].year
//     );
//     runSearch();
//    });
//   });
// }