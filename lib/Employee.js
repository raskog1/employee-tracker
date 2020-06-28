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

      inquirer
        .prompt({
          name: "department",
          type: "list",
          message: "Which department would you like to delete employee from?",
          choices: departments,
        })
        .then(function (res) {
          let queryString = "SELECT first_name, last_name, title";
          queryString += " FROM department d LEFT JOIN role r ON";
          queryString += " d.id = r.department_id LEFT JOIN";
          queryString += " employee e ON r.id = e.role_id WHERE ?";
          queryString += " ORDER BY last_name";

          db.query(queryString, { name: res.department }, function (err, res) {
            console.log(res);
            const employees = res.map(function (element) {
              return (
                element.first_name +
                " " +
                element.last_name +
                " | " +
                element.title
              );
            });

            inquirer
              .prompt({
                name: "associate",
                type: "list",
                message: "Which employee would you like to delete?",
                choices: employees,
              })
              .then(function (data) {
                // Split the associate data to obtain the first and last name separately
                const splitEmp = data.associate.split(" ");

                db.query(
                  // Deleting only based on first and last name match
                  `DELETE FROM employee WHERE first_name = '${splitEmp[0]}' AND last_name = '${splitEmp[1]}'`,
                  function (err, result) {
                    if (err) throw err;
                    console.log(splitEmp[0] + " " + splitEmp[1] + " deleted.");
                  }
                );
              });
          });
        });
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
          let queryString = "SELECT first_name, last_name, title as position";
          queryString += " FROM department d LEFT JOIN role r ON";
          queryString += " d.id = r.department_id LEFT JOIN";
          queryString += " employee e ON r.id = e.role_id WHERE ?";
          queryString += " ORDER BY last_name";

          // Log all results to the terminal, alphabetically by last name
          db.query(queryString, { name: res.department }, function (err, res) {
            const employees = cTable.getTable(res);
            console.log(employees);
          });
        });
    });
  }

  displayEmployees() {
    // Join all three tables without LEFT JOIN to avoid populating NULL
    let queryString =
      "SELECT first_name, last_name, title AS position, name AS department, salary";
    queryString += " FROM department d JOIN role r ON";
    queryString += " d.id = r.department_id JOIN";
    queryString += " employee e ON r.id = e.role_id";
    queryString += " ORDER BY name, last_name";

    db.query(queryString, function (err, res) {
      console.log(res);
      const employees = cTable.getTable(res);
      console.log(employees);
    });
  }
}

module.exports = Employee;
