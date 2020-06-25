const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: 3306,
  user: "root",
  password: "root",
  database: "company_db",
});

connection.connect(function (err) {
  if (err) throw err;
});

class Role {
  constructor() {}

  addRole() {
    connection.query("SELECT name FROM department", function (err, res) {
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
          connection.query("SELECT * FROM department", function (err, result) {
            // Create array of department objects
            const deptArray = result;
            // Find object where department name aligns with what was chosen
            const currentDep = deptArray.find(
              ({ name }) => name === res.depName
            );
            // Store corresponding department ID
            const currentID = currentDep.id;

            console.log(
              `${res.name} is being added to the ${currentDep.name} department...`
            );

            connection.query(
              "INSERT INTO role SET ?",
              {
                title: res.name,
                salary: res.salary,
                department_id: currentID,
              },
              function (err, res) {
                if (err) throw err;
                console.log("Title/role creation completed.");
              }
            );
          });
        });
    });
  }

  removeRole() {
    connection.query("SELECT title FROM role", function (err, res) {
      const roles = [];

      res.forEach((element) => {
        roles.push(element.title);
      }); // why won't res just be an array of titles like dep???

      console.log(res.json);
      inquirer
        .prompt({
          name: "role",
          type: "list",
          message: "Which role would you like to permanently remove?",
          choices: roles, // listing everything as undefined
        })
        .then(function (res) {
          connection.query(
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

  displayRoles() {}
}

module.exports = Role;
