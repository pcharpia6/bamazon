var Inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "IronBreaker0^",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    begin();
});

function begin() {
    Inquirer.prompt([
        {type: "list",
        message: "What would you like to do?\n",
        choices: ["SELL AN ITEM", "BUY AN ITEM"],
        name: "task"}
    ]).then((res) => {
        if (res.task == "SELL AN ITEM") {
            sellItem();
        } else if (res.task == "BUY AN ITEM") {
            buyItem();
        } else {
            console.log("How did this happen?!?");
        }
    })
};

var sellItem = function() {
    let item = "";
    let price = 0;
    askName();
    function askName() {
        Inquirer.prompt([
            {type: "input",
            message: "What is the name of the item?\n",
            name: "item",
            validate: function(item) {return  item == item.trim()}
    }
        ]).then((res) => {
            askPrice();
        })
    };
    function askPrice() {
        Inquirer.prompt([
            {type: "input",
            message: "What is your asking price for the item?\n",
            name: "price",
        validate: function(price) {return price == parseInt(price.trim())}}
        ]).then((res) => {
            pushItem();
        })
    };
    function pushItem() {
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: item,
                
            }
        )
    }
};