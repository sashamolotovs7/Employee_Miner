import pool from './db/db.js';
import inquirer from 'inquirer';
import chalk from 'chalk';

const asciiArt = chalk.blueBright(`
 RRRRRRRRRRRRRRRRR   
 R::::::::::::::::R  
 R::::::RRRRRR:::::R 
 RR:::::R     R:::::R
   R::::R     R:::::R
   R::::R     R:::::R
   R::::RRRRRR:::::R 
   R:::::::::::::RR  
   R::::RRRRRR:::::R 
   R::::R     R:::::R
   R::::R     R:::::R
   R::::R     R:::::R
 RR:::::R     R:::::R
 R::::::R     R:::::R
 R::::::R     R:::::R
 RRRRRRRR     RRRRRRR

Rosters (R) 2021
Where we keep track of your team! 
`);

console.log(asciiArt);

// Function to view all departments
async function viewDepartments() {
    console.log("Before querying departments");
    try {
        const result = await pool.query('SELECT * FROM department');
        console.log("Number of departments found: ", result.rows.length);
        console.table(result.rows);
    } catch (err) {
        console.error('Error querying departments:', err);
    }
}

// Function to view all roles
async function viewRoles() {
    console.log("Before querying roles");
    try {
        const result = await pool.query('SELECT id, title, salary, department_id FROM role');
        const formattedResults = result.rows.map(row => ({
            id: row.id,
            title: row.title,
            salary: `$${row.salary.toLocaleString()}`,  // Format salary with $
            department_id: row.department_id
        }));
        console.log("Number of roles found: ", formattedResults.length);
        console.table(formattedResults);
    } catch (err) {
        console.error('Error querying roles:', err);
    }
}

// Function to remove a role
async function removeRole() {
    const roles = await pool.query('SELECT id, title FROM role');
    const roleChoices = roles.rows.map(role => ({
        name: role.title,
        value: role.id
    }));
    roleChoices.push({ name: 'Cancel', value: null }); // Add Cancel option

    const { roleId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'roleId',
            message: 'Select the role to remove:',
            choices: roleChoices
        }
    ]);

    if (!roleId) {
        console.log('Operation cancelled.');
        return;
    }

    try {
        await pool.query('DELETE FROM employee WHERE role_id = $1', [roleId]); // Delete associated employees
        await pool.query('DELETE FROM role WHERE id = $1', [roleId]); // Delete role
        console.log(`Role with ID ${roleId} removed successfully.`);
    } catch (err) {
        console.error('Error removing role:', err);
    }
}


// Function to view all employees
async function viewEmployees() {
    console.log("Before querying employees");
    try {
        const result = await pool.query('SELECT * FROM employee');
        console.log("Number of employees found: ", result.rows.length);
        console.table(result.rows);
    } catch (err) {
        console.error('Error querying employees:', err);
    }
}

// Function to add a department
async function addDepartment() {
    const { departmentName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the new department:'
        }
    ]);

    try {
        await pool.query('INSERT INTO department (name) VALUES ($1)', [departmentName]);
        console.log(`Department ${departmentName} added successfully.`);
    } catch (err) {
        console.error('Error adding department:', err);
    }
}

// Function to remove a department
async function removeDepartment() {
    const departments = await pool.query('SELECT id, name FROM department');
    const departmentChoices = departments.rows.map(dept => ({
        name: dept.name,
        value: dept.id
    }));
    departmentChoices.push({ name: 'Cancel', value: null }); // Add Cancel option

    const { departmentId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'departmentId',
            message: 'Select the department to remove:',
            choices: departmentChoices
        }
    ]);

    if (!departmentId) {
        console.log('Operation cancelled.');
        return;
    }

    try {
        await pool.query('DELETE FROM employee WHERE role_id IN (SELECT id FROM role WHERE department_id = $1)', [departmentId]); // Delete employees
        await pool.query('DELETE FROM role WHERE department_id = $1', [departmentId]); // Delete roles
        await pool.query('DELETE FROM department WHERE id = $1', [departmentId]); // Delete department
        console.log(`Department with ID ${departmentId} removed successfully.`);
    } catch (err) {
        console.error('Error removing department:', err);
    }
}


// Function to add a role
async function addRole() {
    const departments = await pool.query('SELECT id, name FROM department');
    const departmentChoices = departments.rows.map(dept => ({
        name: dept.name,
        value: dept.id
    }));

    const { roleName, roleSalary, departmentId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'Enter the name of the new role:'
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'Enter the salary for this role:'
        },
        {
            type: 'list',
            name: 'departmentId',
            message: 'Select the department for this role:',
            choices: departmentChoices
        }
    ]);

    try {
        await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [roleName, roleSalary, departmentId]);
        console.log(`Role ${roleName} added successfully.`);
    } catch (err) {
        console.error('Error adding role:', err);
    }
}

// Function to add an employee
async function addEmployee() {
    const roles = await pool.query('SELECT id FROM role');
    const roleIds = roles.rows.map(role => role.id);

    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the first name of the employee:'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the last name of the employee:'
        },
        {
            type: 'input',
            name: 'roleId',
            message: `Enter the role ID for this employee (valid IDs: ${roleIds.join(', ')}):`
        },
        {
            type: 'input',
            name: 'managerId',
            message: 'Enter the manager ID for this employee (if applicable):'
        }
    ]);

    if (!roleIds.includes(parseInt(roleId))) {
        console.log(`Error: Role ID ${roleId} is not valid.`);
        return;
    }

    try {
        await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, roleId, managerId]);
        console.log(`Employee ${firstName} ${lastName} added successfully.`);
    } catch (err) {
        console.error('Error adding employee:', err);
    }
}

// Function to update an employee's role
async function updateEmployeeRole() {
    const { employeeId, newRoleId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'employeeId',
            message: 'Enter the employee ID for the role update:'
        },
        {
            type: 'input',
            name: 'newRoleId',
            message: 'Enter the new role ID for this employee:'
        }
    ]);

    try {
        await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [newRoleId, employeeId]);
        console.log(`Employee ID ${employeeId} updated successfully.`);
    } catch (err) {
        console.error('Error updating employee role:', err);
    }
}

// Function to remove an employee
async function removeEmployee() {
    const employees = await pool.query('SELECT id, first_name, last_name FROM employee');
    const employeeChoices = employees.rows.map(emp => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id
    }));
    employeeChoices.push({ name: 'Cancel', value: null }); // Add Cancel option

    const { employeeId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee to remove:',
            choices: employeeChoices
        }
    ]);

    if (!employeeId) {
        console.log('Operation cancelled.');
        return;
    }

    try {
        await pool.query('DELETE FROM employee WHERE id = $1', [employeeId]);
        console.log(`Employee with ID ${employeeId} removed successfully.`);
    } catch (err) {
        console.error('Error removing employee:', err);
    }
}

// Function to prompt the user for action
async function promptUser() {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all employees',
                'Add an employee',
                'Update an employee role',
                'Remove an employee',     // New option
                'View all roles',
                'Add a role',
                'Remove a role',          // New option
                'View all departments',
                'Add a department',
                'Remove a department',    // New option
                'Exit'
            ]
        }
    ]);

    switch (action) {
        case 'View all employees':
            await viewEmployees();
            break;
        case 'Add an employee':
            await addEmployee();
            break;
        case 'Update an employee role':
            await updateEmployeeRole();
            break;
        case 'Remove an employee':      // New case
            await removeEmployee();
            break;
        case 'View all roles':
            await viewRoles();
            break;
        case 'Add a role':
            await addRole();
            break;
        case 'Remove a role':           // New case
            await removeRole();
            break;
        case 'View all departments':
            await viewDepartments();
            break;
        case 'Add a department':
            await addDepartment();
            break;
        case 'Remove a department':     // New case
            await removeDepartment();
            break;
        case 'Exit':
            pool.end();
            return;
    }

    await promptUser();  // Loop for continuous interaction
}


// Start the application
promptUser();