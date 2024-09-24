const mysql = require('mysql2');

const pool =  mysql.createPool(process.env.MYSQL_CONNECTION_URI);

const db = pool.promise();

db.execute(`
    CREATE TABLE users (
       id INT PRIMARY KEY AUTO_INCREMENT,
       firstName VARCHAR(100),
       lastName VARCHAR(100),
       email VARCHAR(100) UNIQUE,
       password VARCHAR(255),
       status ENUM('active', 'blocked') DEFAULT 'active',
       registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       last_login TIMESTAMP NULL
    );
`).then(() => {
    console.log('Table created successfully');
}).catch(err => {
    console.log(err);
    console.error('Can not create table');
});

module.exports = db
