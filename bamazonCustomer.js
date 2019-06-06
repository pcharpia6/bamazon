// Dependencies
var Inquirer = require("inquirer");
var mysql = require("mysql");

//Local connection set-up
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "IronBreaker0^",
    database: "bamazon"
});

// initial connection and begin run program
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    beginBuy();
});

// list all items available
function beginBuy() {
    connection.query(
        "SELECT item_id, product_name, price, stock_quantity FROM products",
        function(err, res) {
            if (err) throw err;
            console.log("ITEMS FOR SALE:\n");
            for (let i = 0; i < res.length; i++)  {
                console.log("ID: " + res[i].item_id + ", Name: " + res[i].product_name + ", Price for Each: $" + res[i].price + ", # Available: " + res[i].stock_quantity + "\n");
            };
            buyWhat(res);
        }
    )
};

// request user input for the item to purchase based on the ID listed in beginBuy()
function buyWhat(input) {
    Inquirer.prompt([
        {
        type: "input",
        message: "What is the ID of the item you would like to buy?\n",
        name: "buy_id",
        validate: function(buy_id) {return (buy_id == parseInt(buy_id.trim()) && buy_id <= input.length && buy_id > 0)}
        },
        {
        type: "input",
        message: "How many would you like to buy?\n",
        name: "buy_quant",
        validate: function(buy_quant) {return  buy_quant == buy_quant.trim()}
        }
        ]).then((res) => {
            stockQuant(res);
        })
};

// check that the store has the quantity of items available to fulfill the request
function stockQuant(input) {
    connection.query(
        "SELECT * FROM products WHERE ?",
        {
            item_id: input.buy_id
        },
        function(err, res) {
            if (err) throw err;
            let stock = res[0].stock_quantity;
            let cost = res[0].price * input.buy_quant;
            if (parseInt(stock) >= parseInt(input.buy_quant)) {
                pullStock(input, res);
                console.log("Your purchase is successful.");
                console.log("Your total comes to: $" + cost)
            } else {
                console.log(parseInt(parseInt(input.buy_quant)));
                console.log("Not enough item in stock.\nPlease try again.");
                beginBuy();
            }
        }
    );
};

// update the database for the number of items removed
function pullStock(input, input2) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [{
            stock_quantity: parseInt(input2[0].stock_quantity) - parseInt(input.buy_quant)
        },
        {
            item_id: input.buy_id
        }],
        function(err, res) {
            if (err) throw err;
            console.log(input2[0].stock_quantity - input.buy_quant + " of those items remain.\nThank you for your purchase!")
        }
    );
    // end program
    connection.end();
};