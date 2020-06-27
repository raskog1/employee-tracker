// Declare dependencies
const inquirer = require("inquirer");
const Department = require("./lib/Department");
const Role = require("./lib/Role");
const Employee = require("./lib/Employee");

const department = new Department();
const role = new Role();
const employee = new Employee();

const init = {
  contents: function () {
    inquirer
      .prompt({
        name: "choice",
        type: "list",
        message: "Choose an action:",
        choices: [
          "View All Employees",
          "View All Employees by Department",
          "View All Employees by Manager",
          "View All Roles by Department",
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
            employee.displayEmployeesByDept();
            break;
          case "View All Employees by Manager":
            console.log("You have selected: " + res.choice);
            //function
            break;
          case "View All Roles by Department":
            console.log("You have selected: " + res.choice);
            role.displayRoles();
          case "Add Employee":
            console.log("You have selected: " + res.choice);
            //function
            break;
          case "Remove Employee":
            console.log("You have selected: " + res.choice);
            employee.deleteEmployee();
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
            //db.end();
            break;
        }
      });
  },
};

init.contents();

module.exports = init;
