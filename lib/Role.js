// Declare dependencies
const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("../config/db");

class Role {
  constructor() {}

  addRole() {
    db.query("SELECT * FROM department", function (err, res) {
      // Only pulling department names for inquirer choices
      const departments = res;

      inquirer
        .prompt([
          {
            name: "name",
            type: "input",
            message: "Enter position title/role.",
            validate: function validate(name) {
              return name !== "";
            },
          },
          {
            name: "salary",
            type: "number",
            message: "What is this role's annual salary?",
            validate: function validateNum(salary) {
              return salary !== NaN;
            },
          },
          {
            name: "depName",
            type: "list",
            message: "What department does this role belong to?",
            choices: departments,
          },
        ])
        .then(function (res) {
          const currentDep = res.depName;

          // Find role object that matches the previous selection to assign department_id
          db.query(
            "SELECT id FROM department WHERE ?",
            {
              name: currentDep,
            },
            function (err, result) {
              if (err) throw err;

              console.log(
                `${res.name} is being added to the ${res.depName} department...`
              );

              db.query(
                "INSERT INTO role SET ?",
                {
                  title: res.name,
                  salary: res.salary,
                  department_id: result[0].id,
                },
                function (err, res) {
                  if (err) throw err;
                  console.log("Title/role creation completed.");
                  db.end();
                }
              );
            }
          );
        });
    });
  }

  removeRole() {
    db.query("SELECT title FROM role ORDER BY title", function (err, res) {
      // console.log(res);
      inquirer
        .prompt({
          name: "role",
          type: "list",
          message: "Which role would you like to permanently remove?",
          choices: function () {
            const roles = cTable.getTable(res.title);
            return roles;
          },
        })
        .then(function (res) {
          db.query(
            "DELETE FROM role WHERE ?",
            {
              title: res.role,
            },
            function (err, result) {
              if (err) throw err;
              console.log(res.role + " has been permanently deleted.");
              db.end();
            }
          );
        });
    });
  }

  updateRole() {
    db.query("SELECT * FROM department", function (err, res) {
      // Only pulling department names for inquirer choices
      const departments = res;

      db.query("SELECT * FROM employee", function (err, empData) {
        // Pulling all employees and storing into an array
        const employees = empData.map(function (element) {
          return element.first_name + " " + element.last_name;
        });

        inquirer
          .prompt({
            name: "employee",
            type: "list",
            message: "Who's role would you like to update?",
            choices: employees,
          })
          .then(function (empInfo) {
            const splitEmp = empInfo.employee.split(" ");

            db.query(
              // Deleting only based on first and last name match
              `SELECT * FROM employee WHERE first_name = '${splitEmp[0]}' AND last_name = '${splitEmp[1]}'`,
              function (err, result) {
                if (err) throw err;
                inquirer
                  .prompt({
                    name: "department",
                    type: "list",
                    message: "Choose department for new role",
                    choices: departments,
                  })
                  .then(function (depInfo) {
                    db.query(
                      "SELECT * FROM department LEFT JOIN role ON role.department_id = department.id WHERE ?",
                      { name: depInfo.department },

                      function (err, result) {
                        if (err) throw err;
                        // Map out all roles into an array
                        const roles = result.map(function (element) {
                          return element.title;
                        });

                        inquirer
                          .prompt({
                            name: "newRole",
                            type: "list",
                            message: "Choose new role",
                            choices: roles,
                          })
                          .then(function (roleInfo) {
                            db.query(
                              "SELECT * FROM role WHERE ?",
                              { title: roleInfo.newRole },

                              function (err, res) {
                                db.query(
                                  "UPDATE employee SET ? WHERE ? AND ?",
                                  [
                                    { role_id: res[0].id },
                                    { first_name: splitEmp[0] },
                                    { last_name: splitEmp[1] },
                                  ],
                                  function (err, final) {
                                    console.log(
                                      "Role successfully updated to " +
                                        res[0].title
                                    );
                                    db.end();
                                  }
                                );
                              }
                            );
                          });
                      }
                    );
                  });
              }
            );
          });
      });
    });
  }

  updateMgr() {
    db.query("SELECT * FROM department", function (err, res) {
      // Only pulling department names for inquirer choices
      const departments = res;

      db.query("SELECT * FROM employee", function (err, empData) {
        // Pulling all employees and storing into an array
        const employees = empData.map(function (element) {
          return element.first_name + " " + element.last_name;
        });

        inquirer
          .prompt({
            name: "employee",
            type: "list",
            message: "Who's manager would you like to update?",
            choices: employees,
          })
          .then(function (empInfo) {
            const splitEmp = empInfo.employee.split(" ");

            inquirer
              .prompt({
                name: "manager",
                type: "list",
                message: "Who is the manager for this employee?",
                choices: employees,
              })
              .then(function (mgrInfo) {
                const splitMgr = mgrInfo.manager.split(" ");
                db.query(
                  "SELECT id FROM employee WHERE ? AND ?",
                  [{ first_name: splitMgr[0] }, { last_name: splitMgr[1] }],
                  function (err, data) {
                    if (err) throw err;

                    db.query(
                      "UPDATE employee SET ? WHERE ? AND ?",
                      [
                        { manager_id: data[0].id },
                        { first_name: splitEmp[0] },
                        { last_name: splitEmp[1] },
                      ],
                      function (err, final) {
                        console.log(
                          splitEmp[0] +
                            " " +
                            splitEmp[1] +
                            "'s manager updated successfully"
                        );
                        db.end();
                      }
                    );
                  }
                );
              });
          });
      });
    });
  }

  // Not used
  changeSalary(title, newSalary) {
    db.query(
      "UPDATE role SET ? WHERE ?",
      [
        {
          salary: newSalary,
        },
        {
          title: title,
        },
      ],
      function (err, res) {
        if (err) throw err;
        console.log(`${res.title} updated with a salary of ${res.salary}`);
      }
    );
  }

  // Not used
  changeTitle(newTitle) {
    db.query(
      "UPDATE role SET ? WHERE ?",
      [
        {
          title: newTitle,
        },
        {
          title: title,
        },
      ],
      function (err, res) {
        if (err) throw err;
        console.log(`${res.title} has been updated.`);
      }
    );
  }

  // Not used
  changeDept(title, newDept_id) {
    db.query(
      "UPDATE role SET ? WHERE ?",
      [
        {
          department_id: newDept_id,
        },
        {
          title: title,
        },
      ],
      function (err, res) {
        if (err) throw err;
        console.log(`${res.title} has been moved to a different department`);
      }
    );
  }

  getRoleId(thisRole, cb) {
    db.query(
      "SELECT * FROM role JOIN department ON department.id = role.department_id WHERE title = ?",
      [thisRole],
      function (err, result) {
        if (err) throw err;
        cb(result[0].id);
      }
    );
  }

  getEmployeeId(firstName, lastName, cb) {
    db.query(
      `SELECT id FROM employee WHERE first_name = '${firstName}' AND last_name = '${lastName}'`,
      function (err, result) {
        if (err) throw err;
        cb(result[0].id);
      }
    );
  }

  listRoles(department, cb) {
    // List only roles from a predefined department
    db.query(
      "SELECT title FROM role INNER JOIN department ON department.id = role.department_id WHERE ?",
      { name: department },

      function (err, result) {
        if (err) throw err;
        cb(result);
      }
    );
  }

  displayRoles() {
    // Get a specific department from an array of departments
    db.query("SELECT * FROM department", function (err, res) {
      const departments = res;
      inquirer
        .prompt({
          name: "department",
          type: "list",
          message: "Which department would you like to view roles from?",
          choices: departments,
        })
        .then(function (res) {
          let queryString = "SELECT title AS Position, salary AS Salary ";
          queryString += "FROM role INNER JOIN department ";
          queryString += "ON department.id = role.department_id WHERE ? ";
          queryString += "ORDER BY Salary DESC";

          db.query(queryString, [{ name: res.department }], function (
            err,
            result
          ) {
            const roles = cTable.getTable(result);
            console.log(
              "\n" + "You are viewing roles from " + res.department + ":\n"
            );
            console.log(roles);
            db.end();
          });
        });
    });
  }
}

module.exports = Role;
