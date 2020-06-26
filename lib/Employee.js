// Declare dependencies
const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db");

class Employee {
  constructor() { }

  addEmployee() { }

  deleteEmployee() { }

  displayEmployees() {
    db.query("SELECT * FROM employee", function (err, res) {
      const employees = cTable.getTable(res);
      console.log(employees);
    });
  }
}

module.exports = Employee;
