require('dotenv').config();
const { exec } = require('child_process');

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const schemaCommand = `psql -U ${DB_USER} -d ${DB_NAME} -h ${DB_HOST} -p ${DB_PORT} -f ./db/schema.sql`;
const seedsCommand = `psql -U ${DB_USER} -d ${DB_NAME} -h ${DB_HOST} -p ${DB_PORT} -f ./db/seeds.sql`;

console.log("Executing schema.sql...");

exec(schemaCommand, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error running schema.sql: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);

    console.log("Executing seeds.sql...");

    exec(seedsCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running seeds.sql: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
    });
});
