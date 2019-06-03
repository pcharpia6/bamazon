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
    beginBuy();
});

function beginBuy() {
    connection.query(
        "SELECT item_id, product_name, price FROM products",
        function(err, res) {
            if (err) throw err;
            console.log("ITEMS FOR SALE:\n")
            for (let i = 0; i < res.length; i++) {console.log(res[i])}
            buyWhat();
        }
    )
};

function buyWhat() {
    Inquirer.prompt([
        {
        type: "input",
        message: "What is the ID of the item you would like to buy?\n",
        name: "buy_id",
        validate: function(buy_id) {return buy_id == parseInt(buy_id.trim())}
        },
        {
        type: "input",
        message: "How many would you like to buy?\n",
        name: "buy_quant",
        validate: function(buy_quant) {return  buy_quant == buy_quant.trim()}
        }
        ]).then((res) => {
            console.log("buywhat response: " + res);
            stockQuant(res);
        })
};

function stockQuant(input) {
    connection.query(
        "SELECT stock_quantity FROM products WHERE ?",
        {
            item_id: input.buy_id
        },
        function(err, res) {
            if (err) throw err;
            let stock = res[0].stock_quantity;
            if (parseInt(stock) >= parseInt(input.buy_quant)) {
                pullStock(input);
                console.log("Your purchase is successful.")
            } else {
                console.log(parseInt(parseInt(input.buy_quant)));
                console.log("Not enough item in stock.\nPlease try again.");
                beginBuy();
            }
        }
    );
};

function pullStock(input) {
    connection.query(
        "UPDATE stock_quantity FROM products WHERE ?",
        {
            item_id: input.item_id
        }
    )
}

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

var buyItem = function() {

}