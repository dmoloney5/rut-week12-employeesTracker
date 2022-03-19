INSERT INTO department (department_name)
VALUES
  ('HR'),
  ('Tech'),
  ('Marketing'),
  ('Finance'),
  ('Sales'),
  ('Engineering'),
  ('Legal');
  
INSERT INTO role (title, salary, department_id)
VALUES
  ('Sales Lead', 160000, 5),
  ('Marketer', 85000, 3),
  ('Software Engineer', 160000, 2),
  ('Attorney', 250000, 7),
  ('Salesperson', 145000, 5),
  ('Engineer', 110000, 6),
  ('Recruiter ', 45000, 1),
  ('Accountant', 125000, 7),
  ('CTO', 200000, 4),
  ('CEO', 400000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Dennis', 'Fitzpatrick', 4, 1),
  ('Robin', 'Regan', 2, 2),
  ('Ryan', 'Potter', 3, 1),
  ('Thomas', 'Hatt', 4, 3),
  ('John', 'Doe', 5, 1),
  ('Steve', 'Allen', 6, 3),
  ('Richard', 'Smith', 5, 3),
  ('Jane', 'Doe', 6, 3);