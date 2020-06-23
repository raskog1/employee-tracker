const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: 3306,
  user: "root",
  password: "",
  database: "company_db",
});
