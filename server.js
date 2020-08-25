var mysql = require("mysql");
var inquirer = require("inquirer");
const { CLIENT_RENEG_LIMIT } = require("tls");
require("console.table");
var connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "password",
  database: "employees_db"
});
connection.connect(function(err) {
    if (err) throw err;
    runSearch();
});
//switch case with inquirer 
//inquirer prompts, with switch case that says
//if user does this, run this inquirer prompt, if the user runs that, run that inquirer prompt

//view departments, roles and employees
function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do:",
            choices: [
                "View All Employees",
                "View All Employees By Role",
                "View All Departments By Role",
                "Add Role",
                "Exit"
            ]
        })
        .then(answer => {
            //switch cases for options
            switch(answer.action) {
            case "View All Employees":
                allEmployees();
                break;
            case "View All Employees By Role":
                employeesByRole();
                break;
            case "View All Departments By Role":
                departmentsByRole();
                break;
            case "Add Role":
                addRole();
                break;
            case "Exit":
                break;
        }
        })
}


function allEmployees() {
    var query = "SELECT first_name, last_name, employee.id, title FROM employee INNER JOIN role ON employee.role_id = role.id";
    connection.query(query, function(err, res){
        let data = JSON.parse(JSON.stringify(res));
        console.table(res);
        console.log("================================================");
        runSearch();
    });
}

function employeesByRole() {
    var query = "SELECT title, employee.id, first_name, last_name FROM role INNER JOIN employee ON role.id = employee.id";
    connection.query(query, function(err, res){
        let data = JSON.parse(JSON.stringify(res));
        console.table(res);
    })
}

function departmentsByRole() {
    var query = "SELECT department_id, name, salary FROM department INNER JOIN role ON department.id = role.department_id";
    connection.query(query, function(err,res){
        let data = JSON.parse(JSON.stringify(res));
        console.table(res);
    })
}
    
function addRole() {
    var dept = "SELECT name FROM department";
    connection.query(dept, function(err,res) {

        let data = JSON.parse(JSON.stringify(res));
        let departmentArr = [];

        for(var i = 0; i < data.length; i++){
            departmentArr.push(data[i].name);
        }
        console.log("dept Arr: ", departmentArr);
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Choose the department to add the role too: ",
                    choices: departmentArr,
                    name: "department"
                }
            ])

    })
}