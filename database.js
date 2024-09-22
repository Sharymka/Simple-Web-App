const mysql = require('mysql2');

const pool =  mysql.createPool({
    host: 'localhost',
    user: 'root',
    port: 3307,
    password: 'password',
    database: 'webApp'
});

module.exports = pool.promise();
