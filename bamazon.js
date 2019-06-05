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
        "SELECT item_id, product_name, price, stock_quantity FROM products",
        function(err, res) {
            if (err) throw err;
            console.log("ITEMS FOR SALE:\n");
            for (let i = 0; i < res.length; i++)  {
                console.log("ID: " + res[i].item_id + ", Name: " + res[i].product_name + ", Price for Each: " + res[i].price + ", # Available: " + res[i].stock_quantity + "\n");
            };
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
                pullStock(input, res);
                console.log("Your purchase is successful.")
            } else {
                console.log(parseInt(parseInt(input.buy_quant)));
                console.log("Not enough item in stock.\nPlease try again.");
                beginBuy();
            }
        }
    );
};

function pullStock(input, input2) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [{
            stock_quantity: input2[0].stock_quantity - input.buy_quant
        },
        {
            item_id: input.buy_id
        }],
        function(err, res) {
            // console.log(res);
            if (err) throw err;
            console.log(input2[0].stock_quantity - input.buy_quant + " of those items remain.\nThank you for your purchase!")
        }
    );
    connection.end();
}

// function begin() {
//     Inquirer.prompt([
//         {type: "list",
//         message: "What would you like to do?\n",
//         choices: ["SELL AN ITEM", "BUY AN ITEM", "EXIT"],
//         name: "task"}
//     ]).then((res) => {
//         if (res.task == "SELL AN ITEM") {
//             sellItem();
//         } else if (res.task == "BUY AN ITEM") {
//             buyItem();
//         } else {
//             connection.end();
//         }
//     })
// };

// var sellItem = function() {
//     let item = "";
//     let price = 0;
//     askName();
//     function askName() {
//         Inquirer.prompt([
//             {type: "input",
//             message: "What is the name of the item?\n",
//             name: "name",
//             validate: function(name) {return  name == name.trim()}
//             },
//             {type: "input",
//             message: "What department does the item belong in?\n",
//             name: "dept",
//             validate: function(dept) {return  dept == dept.trim()}
//             },
//             {type: "input",
//             message: "What is your asking price for this item?\n",
//             name: "price",
//             validate: function(price) {return price == parseInt(price.trim())}},
//             {type: "input",
//             message: "How many of this item are for sale?\n",
//             name: "quant",
//             validate: function(quant) {return quant == parseInt(quant.trim())}}
//         ]).then((ent) => {
//             pushItem(ent);
//         })
//     };
//     function pushItem(ent) {
//         connection.query(
//             "INSERT INTO products SET ?",
//             {
//                 product_name: ent.name.toUpperCase(),
//                 department_name: ent.dept.toUpperCase(),
//                 price: ent.price.toUpperCase(),
//                 stock_quantity: ent.quant.toUpperCase()
//             },
//             function(err, res) {
//                 if (err) throw err;
//                 console.log("Your item(s) were added successfully.");
//             }
//         )
//     }
// };

// var buyItem = function() {

// }