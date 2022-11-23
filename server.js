require('dotenv').config()

const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require('console.table');


const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'employee_db',
});


const userPrompt = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: ['View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'None']
        }
    ])
    .then((answers) => {
        const { choices } = answers;

        if (choices === "View all departments") {
            viewDepartments();
        }

        if (choices === "View all roles") {
            viewRoles();
        }

        if (choices === "View all employees") {
            viewEmployees();
        }

        if (choices === "Add a department") {
            addDepartment();
        }

        if (choices === "Add a role") {
            addRole();
        }

        if (choices === "Add an employee") {
            addEmployee();
        }

        if (choices === "Update an employee role") {
            updateEmployee();
        }


    })
};

viewDepartments = () => {
    console.log('Viewing all departments.')
}

viewRoles = () => {
    console.log('Viewing all roles.')
}

viewEmployees = () => {
    console.log('Viewing all Employees.')
}

addDepartment = () => {
    
}

addRole = () => {
    
}

addEmployee = () => {
    
}

updateEmployee = () => {
    
}