// Declare dependencies
const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("../config/db");
const Role = require("./Role");

const role = new Role();

class Employee {
  constructor() {}

  addEmployee() {
    db.query("SELECT * FROM department", function (err, res) {
      // Only pulling department names for inquirer choices
      const departments = res;

      inquirer
        .prompt([
          {
            name: "firstName",
            type: "input",
            message: "First name of employee: ",
          },
          {
            name: "lastName",
            type: "input",
            message: "Last name of employee: ",
          },
          {
            name: "department",
            type: "list",
            message: "What department does employee belong to?",
            choices: departments,
          },
        ])
        .then(function (data) {
          // Getting list of roles pertaining only to the department selected
          // by joining the role an department tables.
          db.query(
            "SELECT title FROM role INNER JOIN department ON department.id = role.department_id WHERE ? ORDER BY title",
            { name: data.department },
            function (err, result) {
              if (err) throw err;
              // Creates an array of roles for inquirer use
              const roles = result.map((element) => {
                return element.title;
              });

              // Creating a list of existing employees for use in the manager question
              let queryString = "SELECT first_name, last_name, title";
              queryString += " FROM department d JOIN role r ON";
              queryString += " d.id = r.department_id JOIN";
              queryString += " employee e ON r.id = e.role_id WHERE ?";
              queryString += " ORDER BY last_name";

              // Combining the elements we selected to present nicely
              db.query(queryString, { name: data.department }, function (
                err,
                res
              ) {
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
                  .prompt([
                    {
                      name: "role",
                      type: "list",
                      message: "What position will employee hold?",
                      choices: roles,
                    },
                    {
                      name: "hasManager",
                      type: "confirm",
                      message:
                        "Will new employee be managed by another existing employee?",
                    },
                    {
                      name: "manager",
                      type: "list",
                      message: "Who will be their direct manager?",
                      choices: employees,
                      when: function (answers) {
                        return answers.hasManager === true;
                      },
                    },
                  ])
                  .then(function (result) {
                    // If employee has a manager, get that manager's id number to add
                    if (result.hasManager === true) {
                      const splitEmp = result.manager.split(" ");
                      // Get id of employee indicated as manager
                      role.getEmployeeId(splitEmp[0], splitEmp[1], function (
                        empID
                      ) {
                        role.getRoleId(result.role, function (res) {
                          db.query(
                            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
                            [data.firstName, data.lastName, res, empID],
                            function (err, res) {
                              if (err) throw err;
                              console.log("Employee added successfully");
                              db.end();
                            }
                          );
                        });
                      });
                      // If no manager was indicated, add employee with manager_id being null
                    } else {
                      role.getRoleId(result.role, function (res) {
                        db.query(
                          "INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)",
                          [data.firstName, data.lastName, res],
                          function (err, res) {
                            if (err) throw err;
                            console.log("Employee added successfully");
                            db.end();
                          }
                        );
                      });
                    }
                  });
              });
            }
          );
        });
    });
  }

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
          // Getting employee full name and position for inquirer choices
          let queryString = "SELECT first_name, last_name, title";
          queryString += " FROM department d LEFT JOIN role r ON";
          queryString += " d.id = r.department_id LEFT JOIN";
          queryString += " employee e ON r.id = e.role_id WHERE ?";
          queryString += " ORDER BY last_name";

          db.query(queryString, { name: res.department }, function (err, res) {
            // Combining the employee data to populate nicely
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
                    db.end();
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
          message: "Which department would you like to display employees from?",
          choices: departments,
        })
        .then((res) => {
          // Join all three tables and pull out only rows that match the department
          let queryString = "SELECT first_name, last_name, title as position";
          queryString += " FROM department d JOIN role r ON";
          queryString += " d.id = r.department_id JOIN";
          queryString += " employee e ON r.id = e.role_id WHERE ?";
          queryString += " ORDER BY last_name";

          // Log all results to the terminal, alphabetically by last name
          db.query(queryString, { name: res.department }, function (err, res) {
            const employees = cTable.getTable(res);
            console.log(employees);
            db.end();
          });
        });
    });
  }

  displayEmployeesByMgr() {
    db.query("SELECT * FROM employee", function (err, res) {
      // Only pulling employee names for inquirer choices
      const employees = res.map(function (element) {
        return element.first_name + " " + element.last_name;
      });

      inquirer
        .prompt({
          name: "manager",
          type: "list",
          message: "Which manager would you like to view?",
          choices: employees,
        })
        .then((data) => {
          const splitEmp = data.manager.split(" ");

          db.query(
            `SELECT * FROM employee WHERE first_name = '${splitEmp[0]}' AND last_name = '${splitEmp[1]}'`,
            // Getting id number from manager selected above
            function (err, result) {
              if (err) throw err;
              const employeeID = result[0].id;

              let queryString =
                "SELECT first_name, last_name, title AS position, name AS department, salary";
              queryString += " FROM department d JOIN role r ON";
              queryString += " d.id = r.department_id JOIN";
              queryString += " employee e ON r.id = e.role_id WHERE ?";
              queryString += " ORDER BY last_name";
              // Get all employees with manager_id matching the id number obtained prior
              db.query(queryString, { manager_id: employeeID }, function (
                err,
                list
              ) {
                const employees = cTable.getTable(list);
                console.log(employees);
                db.end();
              });
            }
          );
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
      const employees = cTable.getTable(res);
      console.log(employees);
      db.end();
    });
  }
}

module.exports = Employee;
