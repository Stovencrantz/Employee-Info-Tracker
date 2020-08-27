const connection = require("./config/connection.js");
const mysql = require("mysql");
const inquirer = require("inquirer");

connection.connect(function(err) {
    if (err) throw err;
    runSearch();
});
//switch case with inquirer 
//inquirer prompts, with switch case that says
//if user does this, run this inquirer prompt, if the user runs that, run that inquirer prompt

//view allDepartments, roles and employees
function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do:",
            choices: [
                "View All Employees",
                "View All Roles",
                "View All Departments",
                "Add Employee",
                "Add Role",
                "Add Department",
                "Exit"
            ]
        })
        .then(answer => {
            //switch cases for options
            switch(answer.action) {
            case "View All Employees":
                allEmployees();
                break;
            case "View All Roles":
                allRoles();
                break;
            case "View All Departments":
                allDepartments();
                break;
            case "Add Employee": 
                addEmployee();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Exit":
                break;
        }
        })
}


function allEmployees() {
    var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department, employee.manager_id FROM employee INNER JOIN role ON employee.id = role.id INNER JOIN department ON department.id = role.department_id ORDER BY id;";
    connection.query(query, function(err, res){
        let data = JSON.parse(JSON.stringify(res));
        console.table(res);
        console.log("================================================");
        runSearch();
    });
}

function allRoles() {
    var query = "SELECT role.title, department.department, role.department_id FROM role INNER JOIN department ON department.id = role.department_id ORDER BY department_id; ";
    connection.query(query, function(err, res){
        let data = JSON.parse(JSON.stringify(res));
        console.table(res);
        console.log("================================================");
        runSearch();
    })
}

function allDepartments() {
    var query = "SELECT department.id, department.department FROM department ORDER BY id;";
    connection.query(query, function(err,res){
        let data = JSON.parse(JSON.stringify(res));
        console.table(res);
        console.log("================================================");
        runSearch();
    })
}

//add an employee
function addEmployee() {

}

//Add a role
function addRole() {
    var dept = "SELECT * FROM department ORDER BY id";
    connection.query(dept, function(err,res) {

        var data = JSON.parse(JSON.stringify(res));
        console.log(data);
        let departmentArr = [];

        for(var i = 0; i < data.length; i++){
            departmentArr.push(data[i].id + ". "+ data[i].department);
        }
        console.log("dept Arr: ", departmentArr);
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Choose the department to add the role too: ",
                    choices: departmentArr,
                    name: "chosenDepartment"
                }, {
                    type: "input",
                    message: "Please enter the role you would like to add:",
                    name: "newRole"
                },  {
                    type: "input",
                    message: "Please enter the salary of this role: ",
                    name: "salary"
                }
            ])
            .then(answer => {
                //answer holds the department we want to add a role to
                console.log("the role the user wants to add: ", answer.chosenDepartment)
                let targetDeptId = answer.chosenDepartment.split(". ")[0];
                let targetDept = answer.chosenDepartment.split(". ")[1];

                console.log("The department we will add a role too: ", targetDept);
                console.log("The department id the user wants to add role too: ", targetDeptId);
                // this answer holds the value of the role we want to add
                console.log("New role we want to add: ", answer.newRole);
                let query = "INSERT INTO role SET ?";
            
                console.log("Submitted data: ", answer.newRole + " " + answer.salary + " " + targetDeptId);

                connection.query(query, 
                    {
                        title: answer.newRole,
                        salary: answer.salary,
                        department_id: targetDeptId
                    },
                    function(err, res) {
                    
                        // console.log("Our query: ", query);
                        console.log("***added our new role***");
                        runSearch();
                        })
            });
    });
}



//add a department 
function addDepartment() {
    inquirer    
        .prompt([
            {
                type: "input",
                message: "Please enter the new department you would like to add: ",
                name: "newDept"
            }
        ])
        .then(answer => {
            console.log("The user wants to add a " + answer.newDept);
            let query = "INSERT INTO department SET ?"
            connection.query(query, {department: answer.newDept}, function(err, res){
                console.log("***Added a new department***");
                runSearch();
            })

        })
}

