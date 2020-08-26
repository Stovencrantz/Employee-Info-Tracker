
USE employees_db;

INSERT INTO department
    (department)
VALUES
    ("Sales"),
    ("Engineering"),
    ("HR"),
    ("IT");

INSERT INTO role
    (title, salary, department_id)
VALUES
    ("Sales Person", 100000, 1),
    ("Mechanical Engineer", 120000, 2),
    ("Software Engineer", 1000000, 2),
    ("Junior Engineer", 85000, 2),
    ("Human Resources", 80000, 3),
    ("IT", 70000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES  
    ("Erin", "Platvoet", 1, 1),
    ("Manoli", "IDK", 2, 2),
    ("Hojin", "M", 2, NULL), 
    ("Thomas", "Chalame", 2, NULL),
    ("Kyle", "Andie", 3, 3),
    ("Ed", "Gibbons", 4, 4);