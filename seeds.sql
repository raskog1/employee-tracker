INSERT INTO department
    (name)
VALUES
    ("Kitchen"),
    ("Front Desk"),
    ("Housekeeping"),
    ("Engineering"),
    ("Banquets"),
    ("Human Resources")

INSERT INTO role
    (title, salary, department_id)
VALUES
    ("Executive Chef", 90000, 1),
    ("Director of Housekeeping", 70000, 3),
    ("Housekeeping Manager", 50000, 3);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ("Shabina", "Khan", 3, 2);

SELECT *
FROM department;
SELECT *
FROM role;
SELECT *
FROM employee;