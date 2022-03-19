const express = require('express');
const inquirer = require("inquirer");
const { connect } = require('./db/connection');
const db = require('./db/connection');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// Start the prompt functions
const startPrompt = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Greetings, How can I help?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add A Department',
                'Add A Role',
                'Add An Employee',
                'Update An Employee Role',
                'Update An Employee Manager',
                'Delete Department',
                'Delete Role',
                'Delete Employee',
                "Quit"
            ]
        }
    ])
        .then(function (choices) {
            
            if (choices === 'View All Employees') {
                viewAllEmployees();
            }else if (choices === 'View All Departments') {
                viewAllDepartments();
            }else if (choices === 'View All Roles') {
                viewAllRoles();
            }else if (choices === 'Add A Department') {
                addDepartment();
            }else if (choices === 'Add A Role') {
                addRole();
            }else if (choices === 'Add An Employee') {
                addEmployee();
            }else if (choices === 'Update An Employee Role') {
                updateEmployeeRole();
            }else if (choices === 'Update An Employee Manager') {
                updateEmployeeManager();
            }else if (choices === 'Delete Department') {
                deleteDepartment();
            }else if (choices === 'Delete Role') {
                deleteRole();
            }else if (choices === 'Delete Employee') {
                deleteEmployee();
            }else if (choices === 'Quit') {
                Connection.end();
                console.log('You are logged out! Type NPM Start to restart')
            }
        });
};

// View all departments
function viewAllDepartments()  {
    const sql = 'SELECT * FROM department';
        connection.sql(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return;
        }
        console.table(results);
        // startPrompt();
    });
};

// View all roles
function viewAllRoles() {
    const sql = `SELECT * FROM role`;
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return;
        }
        console.table(result);
        startPrompt();
    });
};

// View all employees
function viewAllEmployees() {
    const sql = `SELECT employee.id,
                employee.first_name,
                employee.last_name,
                role.title AS job_title,
                department.department_name,
                role.salary,
                CONCAT(manager.first_name, ' ' ,manager.last_name) AS manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee AS manager ON employee.manager_id = manager.id
                ORDER By employee.id`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
        startPrompt();
    });
};

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
        // console.log(`Server running on port ${PORT}`);
    });
});

startPrompt();