const connection = require("./config/connection.js");
const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");


connection.connect(function(err) {
    if (err) throw err;
    runSearch();
});


//MAIN SEARCH INDEX
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
                "Update Employee Role",
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
            case "Update Employee Role":
                updateEmployee();
                break;
            case "Exit":
                break;
        }
        })
}

// VIEW ALL EMPLOYEES
function allEmployees() {
    var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON department.id = role.department_id ORDER BY id";
    connection.query(query, function(err, res){
        let data = JSON.parse(JSON.stringify(res)); 
        console.table(data);
        console.log("================================================");
        runSearch();
    });
}

//VIEW ALL ROLES
function allRoles() {
    var query = "SELECT role.id, role.title, department.department FROM role INNER JOIN department ON department.id = role.department_id ORDER BY department_id; ";
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

//ADD AN EMPLOYEE
function addEmployee() {
    //get the list of current departments to display in our inquirer prompt
    let query = "SELECT id, title FROM role ORDER BY id"
    connection.query(query, function(err, res){

        var data = JSON.parse(JSON.stringify(res));
        console.log(data);
        let roleArr = [];
    
        for(var i = 0; i < data.length; i++){
            roleArr.push(data[i].id + ". "+ data[i].title);
        }
        console.log("Role Arr: ", roleArr);
    
        inquirer
            .prompt([
                {
                    type: "input",
                    message: "Please enter the employees first name",
                    name: "firstName"
                }, {
                    type: "input",
                    message: "Please enter the employees last name: ",
                    name: "lastName"
                }, {
                    type: "list",
                    message: "Please select the employees role: ",
                    choices: roleArr,
                    name: "role"
                }
            ])
            .then(answer => {
                console.log("The name of our new employee is: ", answer.firstName + " " + answer.lastName);
                console.log("Our employee is a " + answer.role.split(". ")[1] + ", their role id is: " + answer.role.split(". ")[0]);

                //push our data into the employee table
                let query = "INSERT INTO employee SET ?";
                connection.query(query, 
                    {
                        first_name: answer.firstName,
                        last_name: answer.lastName,
                        role_id: answer.role.split(". ")[0]
                    },
                    function(err, res){
                        console.log("***Added an employee***");
                        console.log("================================================");

                        runSearch();
                    })
            })
    });

}

//ADD A ROLE
function addRole() {
    //get the list of departments to add a role to, that will be used in our inquirer list
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
                        console.log("================================================");

                        runSearch();
                        })
            });
    });
}



//ADD A DEPARTMENT
function addDepartment() {
    //prompt user for a new department they want to add
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

            //query to insert the new department into our departments table
            let query = "INSERT INTO department SET ?"
            connection.query(query, {department: answer.newDept}, function(err, res){
                console.log("***Added a new department***");
                console.log("================================================");

                runSearch();
            })
        })
}

//UPDATE EMPLOYEE ROLE
function updateEmployee() {
    //get data from employee table to use in our inquirer list
    let query = "SELECT id, first_name, last_name FROM employee";
    connection.query(query, function(err, res){

        var data = JSON.parse(JSON.stringify(res));
        console.log(data);
        let employeeArr = [];

        //push data from employee table into an empty array that can be used in our prompt list
        for(var i = 0; i < data.length; i++){
            employeeArr.push(
                data[i].id + ". " + data[i].first_name.trim() + " " + data[i].last_name.trim());
        }
        console.log("Employee Arr: ", employeeArr);
        
        //get data from role table to use in our inquirer list
        let query = "SELECT id, title FROM role ORDER BY id"
        connection.query(query, function(err, res){
    
            var data = JSON.parse(JSON.stringify(res));
            let roleArr = [];
            
            //push data from role table into an empty array that can be used in our prompt list
            for(var i = 0; i < data.length; i++){
                roleArr.push(data[i].id + ". "+ data[i].title);
            }
            console.log("Role Arr: ", roleArr);
            //prompt user to enter the employee whose role they want to update and the desired new role
            inquirer    
            .prompt([
                {
                    type: "list",
                    message: "Select an Employees Whose Role You Would Like to Update: ",
                    choices: employeeArr,
                    name: "chosenEmployee"
                }, {
                    type: "list",
                    message: "Please Choose The Employees Updated Role: ",
                    choices: roleArr,
                    name: "updatedRole"
                }
            ])
            .then(answer => {
                console.log("Employee and their new role: " + answer.chosenEmployee + " " + answer.updatedRole);
                console.log("New Role_id: ", answer.updatedRole.split(". ")[0]);
                console.log("Employee id: ", answer.chosenEmployee.split(". ")[0]);

                //query to the employee table to update the role_id column of our specified employee id
                let query = "UPDATE employee SET ? WHERE ?";
                connection.query(query,                 
                    [
                        {role_id: answer.updatedRole.split(". ")[0]},
                        {id: answer.chosenEmployee.split(". ")[0]}
                    ],
                    function (err, res) {
                        console.log("***Updated an employees role***");
                        console.log("================================================");

                        runSearch();
                    }
                )
             })
        })
    })
}

