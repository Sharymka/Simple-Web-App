const express = require('express');
const server = express();
const db = require('./database'); // Путь к вашему файлу конфигурации

server.get('/test-db', async (req, res) => {
    try {
        const [results] = await db.query('SELECT 1 AS test');
        res.json(results);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
server.listen(3001, () => {
    console.log('Server is running on port 3001');
});