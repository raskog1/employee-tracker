INSERT INTO department
    (id, name)
VALUES
    ("Kitchen"),
    ("Front Desk"),
    ("Housekeeping"),
    ("Engineering"),
    ("Banquets"),
    ("Human Resources");

INSERT INTO role
    (title, salary, department_id)
VALUES
    ("Executive Chef", 90000, 1),
    ("Director of Housekeeping", 70000, 3),
    ("Housekeeping Manager", 50000, 3),
    ("Public Area Attendant", 35000, 3),
    ("Cook I", 40000, 1),
    ("Guest Service Agent", 40000, 2);

INSERT INTO employee
    (first_name, last_name, role_id)
VALUES
    ("Shabina", "Khan", 3),
    ("Vincent", "Alexander", 1),
    ("Ryan", "Skog", 2),
    ("Timote", "Loketi", 4),
    ("Douglas", "Logan", 6),
    ("Chris", "Troughton", 5);