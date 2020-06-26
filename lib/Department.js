// Declare dependencies
const inquirer = require("inquirer");
const db = require("./db");

class Department {
  constructor() { }

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
          } // Is this function even needed?  Or does it just catch ERR?
        );
      });
  }

  deleteDep() {
    db.query("SELECT name FROM department", function (err, res) {
      const departments = res;
      console.log(res);
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
  }
}

module.exports = Department;
