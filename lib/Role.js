// Declare dependencies
const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db");

class Role {
  constructor() { }

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
                }
              );
            }
          );
        });
    });
  }

  removeRole() {
    db.query("SELECT title FROM role", function (err, res) {
      const roles = res.map((role) => ({
        name: role.title,
      }));

      // res.forEach((element) => {
      //   roles.push(element.title);
      // }); // why won't res just be an array of titles like dep???

      console.log(res);
      inquirer
        .prompt({
          name: "role",
          type: "list",
          message: "Which role would you like to permanently remove?",
          choices: roles,
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
            }
          );
        });
    });
  }

  updateRole() { }

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

  displayRoles() {
    db.query("SELECT * FROM role", function (err, res) {
      const roles = cTable.getTable(res);
      console.log(roles);
    });
  }
}

module.exports = Role;
