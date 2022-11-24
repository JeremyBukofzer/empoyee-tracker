INSERT INTO department (name)
VALUES
('Sales'),
('Engineering'),
('Finance'),
('legal');


INSERT INTO role (title, salary, department_id)
VALUES
('Salesperson', 80000, 1),
('Lead Engineer', 150000, 2),
('Software Engineer', 120000, 2),
('Account Manager', 160000, 3),
('Accountant', 125000, 3),
('Legal Team Lead', 250000, 4),
('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Mike', 'Chan', 1, null),
('Ashley', 'Rodriguez', 2, null),
('Kevin', 'Tupik', 3, 2),
('Kunal', 'Singh', 4, null),
('Malia', 'Brown', 5, 4),
('Sarah', 'Lourd', 6, null),
('Tom', 'Allen', 7, 6);