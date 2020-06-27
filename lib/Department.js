// Declare dependencies
const inquirer = require("inquirer");
const db = require("../config/db");
const server = require("../server");

class Department {
  constructor() {}

  addDep() {
    inquirer
      .prompt({
        name: "name",
        type: "input",
        message: "Enter department name.",
        validate: function validate(name) {
          return name !== "";
        },
      })
      .then(function (res) {
        db.query(
          "INSERT INTO department SET ?",
          {
            name: res.name,
          },
          function (err, result) {
            if (err) throw err;
            console.log(res.name + " successfully added.");
          }
        );
        server.init.contents();
      });
  }

  deleteDep() {
    db.query("SELECT name FROM department", function (err, res) {
      const departments = res;
      inquirer
        .prompt({
          name: "selection",
          type: "list",
          message: "Which department would you like to delete?",
          choices: departments,
        })
        .then(function (res) {
          db.query(
            "DELETE FROM department WHERE ?",
            {
              name: res.selection,
            },
            function (err, result) {
              if (err) throw err;
              console.log(res.selection + " has been permanently deleted.");
            }
          );
        });
    });
    server.contents();
  }
}

module.exports = Department;
