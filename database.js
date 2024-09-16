const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'user',
    password: 'password2',
    database: 'webApp'
});

module.exports = pool.promise();
