-- Clear existing data and reset IDs
TRUNCATE TABLE employee, role, department RESTART IDENTITY CASCADE;

-- Insert departments
INSERT INTO department (name)
VALUES
    ('Avengers'),
    ('X-Men'),
    ('Guardians of the Galaxy'),
    ('Fantastic Four'),
    ('SHIELD'),
    ('Wakanda'),
    ('Asgard'),
    ('Daily Bugle');

-- Insert roles
INSERT INTO role (title, salary, department_id)
VALUES
    ('Crime Fighter', 1000000, 1),
    ('City Patrol', 900000, 1),
    ('Sales', 950000, 7),
    ('Staff', 1200000, 6),
    ('Engineer', 50000, 8),
    ('Project Manager', 850000, 2),
    ('HR', 25000, 3),
    ('Rogue', 600000, 4);

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Tony', 'Stark', 1, NULL),
    ('Steve', 'Rogers', 2, NULL),
    ('Thor', 'Odinson', 3, NULL),
    ('Natasha', 'Romanoff', 4, NULL),
    ('Peter', 'Parker', 5, NULL),
    ('Logan', '', 6, NULL),
    ('Peter', 'Quill', 7, NULL),
    ('Reed', 'Richards', 8, NULL);
