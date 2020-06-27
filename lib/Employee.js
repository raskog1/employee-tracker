// Declare dependencies
const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("../config/db");

class Employee {
  constructor() {}

  addEmployee() {}

  deleteEmployee() {
    db.query("SELECT * FROM department", function (err, res) {
      // Only pulling department names for inquirer choices
      const departments = res;

      // console.log(res);
      inquirer
        .prompt({
          name: "department",
          type: "list",
          message: "Which department would you like to delete employee from?",
          choices: departments,
        })
        .then(function (res) {
          db.query(
            "SELECT employee.first_name, employee.last_name FROM department d JOIN role r ON d.id = r.foreignkey JOIN employee e ON r.id = e.role_id",
            // [{ name: res.department }],
            function (err, res) {
              const employees = cTable.getTable(res);
              console.log(employees);
            }
          );
        });

      // db.query(
      //   "DELETE FROM employee WHERE ?",
      //   {
      //     title: res.role,
      //   },
      //   function (err, result) {
      //     if (err) throw err;
      //     console.log(res.role + " has been permanently deleted.");
      //   }
      // );
    });
  }

  displayEmployeesByDept() {
    db.query("SELECT * FROM department", function (err, res) {
      // Only pulling department names for inquirer choices
      const departments = res;

      inquirer
        .prompt({
          name: "department",
          type: "list",
          message: "Which department would you like to delete employee from?",
          choices: departments,
        })
        // Join all three tables and pull out only rows that match the department
        .then(function (res) {
          let queryString = "SELECT first_name, last_name, title";
          queryString += " FROM department d LEFT JOIN role r ON";
          queryString += " d.id = r.department_id LEFT JOIN";
          queryString += " employee e ON r.id = e.role_id WHERE ?";
          queryString += " ORDER BY last_name ASC";

          // Log all results to the terminal, alphabetically by last name
          db.query(queryString, { name: res.department }, function (err, res) {
            const employees = cTable.getTable(res);
            console.log(employees);
          });
        });
    });
  }

  displayEmployees() {
    let queryString = "SELECT first_name, last_name, title, name, salary";
    queryString += " FROM department d JOIN role r ON";
    queryString += " d.id = r.department_id JOIN";
    queryString += " employee e ON r.id = e.role_id";
    queryString += " ORDER BY name, last_name ASC";

    db.query(queryString, function (err, res) {
      const employees = cTable.getTable(res);
      console.log(employees);
    });
  }
}

module.exports = Employee;
