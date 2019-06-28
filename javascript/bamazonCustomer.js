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
    console.log("\n\t****************| Manager Interface| ****************")
    inquirer.prompt([{
        type: 'list',
        message: '\n\tPlease pick a menu open: \n\n',
        choices: [
            "\t* View Products for Sale",
            "\t* View Low Inventory",
            "\t* Add to Inventory",
            "\t* Add New Product",
            "\t* Exit\n"
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
                process.exit(0);
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
                viewProducts();
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
    inquirer.prompt([{
        type: "input",
        message: "What Item would you like to add more of?",
        name: "deptToAdd"
    }, {
        type: "input",
        message: "How many would you like to add to the current stock?",
        name: "moreAdded"
    }]).then(function(response) {
        connection.query("SELECT * FROM products WHERE ?", { product_name: response.deptToAdd }, function(err, res) {
            if (err) throw err;
            console.log(res)
            var currentStock = res[0].stock_quantity;
            console.log(currentStock)
            connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: parseInt(response.moreAdded) + parseInt(currentStock) },
                { product_name: response.deptToAdd }
            ], function(err, results) {
                if (err) throw err;
                viewProducts();
            })

        })

    })
};