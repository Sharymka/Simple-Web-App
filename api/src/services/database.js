const mysql = require('mysql2');

const pool =  mysql.createPool(process.env.MYSQL_CONNECTION_URI);

const db = pool.promise();

db.execute(`
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    INDEX(email)
);`).then(() => {
    console.log('Table created successfully');
}).catch(err => {
    console.error('Can not create table');
});

module.exports = db
