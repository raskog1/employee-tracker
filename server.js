// Declare dependencies
const inquirer = require("inquirer");
const db = require("./config/db");
const Department = require("./lib/Department");
const Role = require("./lib/Role");
const Employee = require("./lib/Employee");

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
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Manager",
        "View All Roles by Department",
        "Add Employee",
        "Remove Employee",
        "Add Department",
        //"Remove Department",
        "Add Title/Role",
        //"Remove Title/Role",
        "Update Employee Role",
        "Update Employee Manager",
        "Exit",
      ],
    })
    .then((res) => {
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
          employee.displayEmployeesByMgr();
          break;
        case "View All Roles by Department":
          console.log("You have selected: " + res.choice);
          role.displayRoles();
          break;
        case "Add Employee":
          console.log("You have selected: " + res.choice);
          employee.addEmployee();
          break;
        case "Remove Employee":
          console.log("You have selected: " + res.choice);
          employee.deleteEmployee();
          break;
        case "Add Department":
          console.log("You have selected: " + res.choice);
          department.addDep();
          break;
        // case "Remove Department":
        //   console.log("You have selected: " + res.choice);
        //   department.deleteDep();
        //   break;
        case "Add Title/Role":
          console.log("You have selected: " + res.choice);
          role.addRole();
          break;
        // case "Remove Title/Role":
        //   console.log("You have selected: " + res.choice);
        //   role.removeRole();
        //   break;
        case "Update Employee Role":
          console.log("You have selected: " + res.choice);
          role.updateRole();
          break;
        case "Update Employee Manager":
          console.log("You have selected: " + res.choice);
          role.updateMgr();
          break;
        case "Exit":
          db.end();
          break;
        default:
          contents();
          break;
      }
      //rerun();
    });
}

contents();

function rerun() {
  inquirer
    .prompt({
      name: "anotherSelection",
      type: "confirm",
      message: "Would you like to make another selection?",
    })
    .then((result) => {
      if (result.anotherSelection) {
        contents();
      } else {
        db.end();
      }
    });
}
