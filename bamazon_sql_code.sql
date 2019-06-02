CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(45) NOT NULL ,
department_name VARCHAR(30),
stock_quantity INT NOT NULL,
PRIMARY KEY (item_id)
);

ALTER TABLE products
ADD price INT NOT NULL AFTER department_name;

INSERT INTO products (product_name, department_name, stock_quantity)
VALUES ("Beer", "Grocery", 12);

SELECT * FROM products;