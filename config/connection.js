var mysql = require("mysql2");
require("dotenv").config();


var connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: process.env.MYSQL_KEY,
  database: "employees_db"
});

module.exports = connection;