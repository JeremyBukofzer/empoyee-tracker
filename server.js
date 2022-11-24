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

connection.connect(err => {
    if (err) throw err;
    console.log('connected as ' + connection.threadId);
    afterConnected();
});

afterConnected = () => {
    console.log('Connected to Employee Tracker')
    userPrompt();
}


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
    console.log('Viewing all departments.');
    const sql = `SELECT department_id AS id, department.name AS department FROM department`;

    connection.promise(), query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        userPrompt();
    });
};

viewRoles = () => {
    console.log('Viewing all roles.')
    const sql = `SELECT role.id, role.title, department.name AS department.id`;

    connection.promise(), query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        userPrompt();
    });
}

viewEmployees = () => {
    console.log('Viewing all Employees.')
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;
}

addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDept',
            message: 'What is the name of the department?',
            validate: addDept => {
                if (addDept) {
                    return true;
                } else {
                    console.log('Please enter department name');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const sql = `INSERT INTO department (name)
        VALUES (?)`;

            connection.query(sql, answer.addDept, (err, results) => {
                if (err) throw err;

                viewDepartments();
            })
        })

};

addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What is the role you would like to add?',
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    console.log('Please enter a new role')
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of this role?',
            validate: addSalary => {
                if (isNaN(addSalary)) {
                    return true;
                } else {
                    console.log('Please enter a salary')
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const parameters = [answer.role, answer.salary];

            const roleSql = `SELECT name, id FROM department`;

            connection.promise().query(roleSql, (err, data) => {
                if (err) throw err;

                const dept = data.map(({ name, id }) => ({ name: name, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'dept',
                        message: "What department is this role a part of?",
                        choices: dept
                    }
                ])
                    .then(deptChoice => {
                        const dept = deptChoice.dept;
                        parameters.push(dept);

                        const sql = `INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?)`;

                        connection.query(sql, parameters, (err, result) => {
                            if (err) throw err;
                            console.log(answer.role + ' added to roles.');

                            viewRoles();
                        })
                    })
            })
        })
};

addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the employees first name?',
            validate: addFirst => {
                if (addFirst) {
                    return true;
                } else {
                    console.log('Please enter a first name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the employees last name?',
            validate: addLast => {
                if (addLast) {
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }

            }
        }
    ])
        .then(answer => {
            const parameters = [answer.firstName, answer.lastName]

            const roleSql = `SELECT role.id, role.title FROM role`;

            connection.promise().query(roleSql, (err, data) => {
                if (err) throw err;

                const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the employees role?',
                        choices: roles
                    }
                ])
                    .then(roleChoice => {
                        const role = roleChoice.role;
                        parameters.push(role);

                        const managerSql = `SELECT * FROM employee`;

                        connection.promise().query(managerSql, (err, data) => {
                            if (err) throw err;

                            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: 'Who is the manager of this employee?',
                                    choices: managers
                                }
                            ])
                                .then(managerChoice => {
                                    const manager = managerChoice.manager;
                                    parameters.push(manager);

                                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?, ?, ?, ?)`;

                                    connection.query(sql, params, (err, result) => {
                                        if (err) throw err;
                                        console.log('Employee has been added.')

                                        viewEmployees();
                                    })

                                })
                        })
                    })
            })
        })
};

updateEmployee = () => {

    const employeeSql = `SELECT * FROM employee`;

    connection.promise().query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Which employee would you like to update?',
                choices: employees
            }
        ])
            .then(employeeChoice => {
                const employee = employeeChoice.name;
                const parameters = [];
                parameters.push(employee);

                const roleSql = `SELECT * FROM role`;

                connection.promise().query(roleSql, (err, data) => {
                    if (err) throw err;

                    const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: 'What is the new role for this employee?',
                            choices: roles
                        }
                    ])
                        .then(roleChoice => {
                            const role = roleChoice.role;
                            parameters.push(role);

                            let employee = parameters[0]
                            parameters[0] = role
                            parameters[1] = employee

                            const sql = `UPDATE employee SET role_id = ?`;

                            connection.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log('Employee has been updated.');

                                viewEmployees();
                            })
                        })
                })

            })
    })

};