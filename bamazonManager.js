// dependencies
var Inquirer = require("inquirer");
var mysql = require("mysql");

// switch variable
var idCheck = false;

// local connection set-up
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
    begin();
});

// ask the user which task they want to perform
function begin() {
    Inquirer.prompt([
        {type: "list",
        message: "What would you like to do?\n",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT\n"],
        name: "task"}
    ]).then((res) => {
        switch (res.task) {
            case "View Products for Sale":
                forSale();
                break;
            case "View Low Inventory":
                lowInv();
                break;
            case "Add to Inventory":
                lowInvAdd();
                break;
            case "Add New Product":
                addNew();
                break;
            // for the exit statement
            default:
                connection.end();
                break;
        }
    })
};

// list the items for sale **flips idCheck switch to allow for functions requiring item ID input
function forSale() {
    idCheck = true;
    connection.query(
        "SELECT item_id, product_name, price, stock_quantity FROM products",
        function(err, res) {
            if (err) throw err;
            console.log("ITEMS FOR SALE:\n");
            for (let i = 0; i < res.length; i++)  {
                console.log("ID: " + res[i].item_id + ", Name: " + res[i].product_name + ", Price for Each: $" + res[i].price + ", # Available: " + res[i].stock_quantity + "\n");
            };
            begin();
        }
    );
};

// list the items which are low in inventory
function lowInv() {
    connection.query(
        "SELECT * FROM products WHERE stock_quantity<5",
        function(err, res) {
            if (err) throw err;
            console.log("\nItems with fewer than 5 remaining...\n");
            for (let i = 0; i < res.length; i++)  {
                console.log("ID: " + res[i].item_id + ", Name: " + res[i].product_name + ", Price for Each: " + res[i].price + ", # Available: " + res[i].stock_quantity + "\n");
            };
            begin();
        }
    );
};

// allows user to add stock to existing item - requires switch change
function lowInvAdd() {
    if (!idCheck) {
        console.log("\n***DENIED***\nPlease review item IDs with 'View Items for Sale' before performing this function.\n")
        return begin();
    };
    addWhat();
    // gets user input about the item added
    function addWhat() {
        Inquirer.prompt([
            {
            type: "input",
            message: "What is the ID of the item you would like to restock?\n",
            name: "add_id",
            validate: function(add_id) {return add_id == parseInt(add_id.trim())}
            },
            {
            type: "input",
            message: "How many would you like to add to the stock?\n",
            name: "add_quant",
            validate: function(add_quant) {return  add_quant == add_quant.trim()}
            }
            ]).then((res) => {
                restockQuant(res);
            })
    };
    // gets user input about the number of items added
    function restockQuant(input) {
        connection.query(
            "SELECT stock_quantity FROM products WHERE ?",
            {
                item_id: input.add_id
            },
            function(err, res) {
                if (err) throw err;
                addStock(input, res);
            }
        );
    };
    //adds the stock to the database and logs out function success
    function addStock(input, input2) {
        // parseInt is necessary to prevent string concat
        let stockAssign = function() {return parseInt(input2[0].stock_quantity) + parseInt(input.add_quant)};
        console.log(stockAssign());
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [{
                stock_quantity: stockAssign()
            },
            {
                item_id: input.add_id
            }],
            function(err, res) {
                if (err) throw err;
                console.log(stockAssign() + " of those items now in stock.\nThank you!");
                begin();
            }
        );
    };
};

// add a new item to the stock
function addNew() {
    askName();
    // gets the item values from the user
    function askName() {
        Inquirer.prompt([
            {type: "input",
            message: "What is the name of the item?\n",
            name: "name",
            validate: function(name) {return  name == name.trim().toUpperCase()}
            },
            {type: "input",
            message: "What department does the item belong in?\n",
            name: "dept",
            validate: function(dept) {return  dept == dept.trim().toUpperCase()}
            },
            {type: "input",
            message: "What is the price of this item?\n",
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
    // places the new item into the database
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
                begin();
            }
        )
    };
};