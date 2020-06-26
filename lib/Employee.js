const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: 3306,
  user: "root",
  password: "root",
  database: "company_db",
});

connection.connect(function (err) {
  if (err) throw err;
});

class Employee {
  constructor() {}

  addEmployee() {}

  deleteEmployee() {}

  displayEmployees() {
    connection.query("SELECT * FROM employee", function (err, res) {
      const employees = cTable.getTable(res);
      console.log(employees);
    });
  }
}

module.exports = Employee;
