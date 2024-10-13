import inquirer from "inquirer";
import pool from "./db/db.mts";
import dotenv from "dotenv";
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

("use strict");
const inquirer = require("inquirer");
const promptUser = () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit",
      ],
    },
  ]);
};
const init = () => {
  promptUser().then((answers) => {
    console.log(answers);
    // Placeholder for future functionality
    if (answers.action !== "Exit") {
      init(); // Loop the prompt for continuous user interaction
    }
  });
};
init();
