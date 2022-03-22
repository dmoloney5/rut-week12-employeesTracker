const express = require('express');
const inquirer = require("inquirer");
// const { connect } = require('./db/connection');
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
                'View All Employees',
                'View All Departments',
                'View All Roles',
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
            if (choices.action === 'View All Employees') {
                viewAllEmployees();
            } else if (choices.action === 'View All Departments') {
                viewAllDepartments();
            } else if (choices.action === 'View All Roles') {
                viewAllRoles();
            } else if (choices.action === 'Add A Department') {
                addDepartment();
            } else if (choices.action === 'Add A Role') {
                addRole();
            } else if (choices.action === 'Add An Employee') {
                addEmployee();
            } else if (choices.action === 'Update An Employee Role') {
                updateEmployeeRole();
            } else if (choices.action === 'Update An Employee Manager') {
                updateEmployeeManager();
            } else if (choices.action === 'Delete Department') {
                deleteDepartment();
            } else if (choices.action === 'Delete Role') {
                deleteRole();
            } else if (choices.action === 'Delete Employee') {
                deleteEmployee();
            } else if (choices.action === 'Quit') {
                process.exit();

            }
        });
};

// View all departments
function viewAllDepartments() {
    const sql = 'SELECT * FROM department';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return;
        }
        console.table(result);
        startPrompt();
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

// Add departments
function addDepartment() {
    inquirer.prompt([
        {
            name: "department_name",
            type: "input",
            message: "Please enter the name of the department you want to add to the database."
        }
    ]).then((answer) => {

        const sql = `INSERT INTO department (department_name)
                VALUES (?)`;
        const params = [answer.department_name];
        db.query(sql, params, (err, result) => {
            if (err) throw err;
            console.log('The new department entered has been added successfully to the database.');

            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message })
                    return;
                }
                console.table(result);
                startPrompt();
            });
        });
    });
};

// Add a role
function addRole() {
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "Please enter the title of role you want to add to the database."
        },
        {
            name: "salary",
            type: "input",
            message: "Please enter the salary associated with the role you want to add to the database. (no dots, space or commas)"
        },
        {
            name: "department_id",
            type: "number",
            message: "Please enter the department's id associated with the role you want to add to the database."
        }
    ]).then(function (response) {
        db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [response.title, response.salary, response.department_id], function (err, data) {
            if (err) throw err;
            console.log('The new role entered has been added successfully to the database.');

            db.query(`SELECT * FROM role`, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message })
                    startPrompt();
                }
                console.table(result);
                startPrompt();
            });
        })
    });
};

// Add employees
function addEmployee() {
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "Please enter the first name of the employee you want to add to the database."
        },
        {
            name: "last_name",
            type: "input",
            message: "Please enter the last name of the employee you want to add to the database."
        },
        {
            name: "role_id",
            type: "number",
            message: "Please enter the role id associated with the employee you want to add to the database. Enter ONLY numbers."
        },
        {
            name: "manager_id",
            type: "number",
            message: "Please enter the manager's id associated with the employee you want to add to the database. Enter ONLY numbers."
        }

    ]).then(function (response) {
        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [response.first_name, response.last_name, response.role_id, response.manager_id], function (err, data) {
            if (err) throw err;
            console.log('The new employee entered has been added successfully to the database.');

            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message })
                    startPrompt();
                }
                console.table(result);
                startPrompt();
            });
        })
    });
};

// Update employee role
function updateEmployeeRole() {
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "Please enter the first name of the employee you want update in the database."
        },
        {
            name: "role_id",
            type: "number",
            message: "Please enter the new role number id associated with the employee you want to update in the database. Enter ONLY numbers."
        }
    ]).then(function (response) {
        db.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [response.role_id, response.first_name], function (err, data) {
            if (err) throw err;
            console.log('The new role entered has been added successfully to the database.');

            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message })
                    startPrompt();
                }
                console.table(result);
                startPrompt();
            });
        })
    });
};

// Update employee manager
function updateEmployeeManager() {
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "Please enter the first name of the employee you want update in the database."
        },
        {
            name: "manager_id",
            type: "number",
            message: "Please enter the new manager's id number associated with the employee you want to update in the database. Enter ONLY numbers."
        }
    ]).then(function (response) {
        db.query("UPDATE employee SET manager_id = ? WHERE first_name = ?", [response.manager_id, response.first_name], function (err, data) {
            if (err) throw err;
            console.log("The new manager's id entered has been added successfully to the database.");

            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message })
                    startPrompt();
                }
                console.table(result);
                startPrompt();
            });
        })
    });
};




// Start server after DB connection
db.connect((err) => {
    if (err) throw err;
    // console.log('Database connected.');
    // app.listen(PORT, () => {
    // console.log(`Server running on port ${PORT}`);
    startPrompt();

});

