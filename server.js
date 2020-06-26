const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const Department = require("./lib/Department");
const Role = require("./lib/Role");
const Employee = require("./lib/Employee");

const connection = mysql.createConnection({
  host: 3306,
  user: "root",
  password: "root",
  database: "company_db",
});

connection.connect(function (err) {
  if (err) throw err;
  // Declare function to kick things off with...
  contents();
});

const department = new Department();
const role = new Role();
const employee = new Employee();

function contents() {
  inquirer
    .prompt({
      name: "choice",
      type: "list",
      message: "Choose an action:",
      choices: [
        "View All Employees.",
        "View All Employees by Department",
        "View All Employees by Manager",
        "Add Employee",
        "Remove Employee",
        "Add Department",
        "Remove Department",
        "Add Title/Role",
        "Remove Title/Role",
        "Update Employee Role",
        "Update Employee Manager",
        "Exit",
      ],
    })
    .then(function (res) {
      switch (res.choice) {
        case "View All Employees":
          console.log("You have selected: " + res.choice);
          employee.displayEmployees();
          break;
        case "View All Employees by Department":
          console.log("You have selected: " + res.choice);
          role.displayRoles();
          break;
        case "View All Employees by Manager":
          console.log("You have selected: " + res.choice);
          //function
          break;
        case "Add Employee":
          console.log("You have selected: " + res.choice);
          //function
          break;
        case "Remove Employee":
          console.log("You have selected: " + res.choice);
          //function
          break;
        case "Add Department":
          console.log("You have selected: " + res.choice);
          department.addDep();
          // contents();  --Executing async
          break;
        case "Remove Department":
          console.log("You have selected: " + res.choice);
          department.deleteDep();
          break;
        case "Add Title/Role":
          console.log("You have selected: " + res.choice);
          role.addRole();
          break;
        case "Remove Title/Role":
          console.log("You have selected: " + res.choice);
          role.removeRole();
          break;
        case "Update Employee Role":
          console.log("You have selected: " + res.choice);
          //function
          break;
        case "Update Employee Manager":
          console.log("You have selected: " + res.choice);
          //function
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
}
