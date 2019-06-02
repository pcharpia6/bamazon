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
        choices: ["SELL AN ITEM", "BUY AN ITEM", "EXIT"],
        name: "task"}
    ]).then((res) => {
        if (res.task == "SELL AN ITEM") {
            sellItem();
        } else if (res.task == "BUY AN ITEM") {
            buyItem();
        } else {
            connection.end();
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
            name: "name",
            validate: function(name) {return  name == name.trim()}
            },
            {type: "input",
            message: "What department does the item belong in?\n",
            name: "dept",
            validate: function(dept) {return  dept == dept.trim()}
            },
            {type: "input",
            message: "What is your asking price for this item?\n",
            name: "price",
            validate: function(price) {return price == parseInt(price.trim())}},
            {type: "input",
            message: "How many of this item are for sale?\n",
            name: "quant",
            validate: function(quant) {return quant == parseInt(quant.trim())}}
        ]).then((ent) => {
            pushItem(ent);
        })
    };
    function pushItem(ent) {
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: ent.name.toUpperCase(),
                department_name: ent.dept.toUpperCase(),
                price: ent.price.toUpperCase(),
                stock_quantity: ent.quant.toUpperCase()
            },
            function(err, res) {
                if (err) throw err;
                console.log("Your item(s) were added successfully.");
            }
        )
    }
};