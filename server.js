require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const session = require('express-session');
const db = require('./database'); // Путь к вашему файлу конфигурации
const bcrypt = require('bcrypt');
const cors = require('cors');
const {generateToken, verifyToken} = require("./api/src/utils/jwService");

const { isAuthenticated } = require('./api/src/middlewares/isAuthenticated.js');


const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use(cors());

server.use(session({
    secret: 'supersecretkey',  // Ключ для подписи cookie
    resave: false,             // Сессия не будет сохраняться, если ничего не изменилось
    saveUninitialized: false,  // Не сохранять пустые сессии
    cookie: { maxAge: 60000 }  // Срок жизни cookie — 1 минута
}));

server.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [result] = await db.execute('INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)', [firstName, lastName, email, hashedPassword ]);
        req.session.userId = result.insertId;
        return res.status(201).json({ message: 'User registered'});
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Registration failed' });
    }
});

server.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Найти пользователя по email
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ error: 'email not found' });
        }

        // Проверить правильность пароля
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        req.session.userId = user.id;
        console.log("session id ",req.session.userId);

        return res.status(201).json({ message: 'User authorized'});

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }

});


server.get('/users', async (req, res) => {
    try {
        // Выполните все асинхронные операции здесь
        const [users] = await db.execute('SELECT id, firstName, lastName, email, status FROM users');
        return res.status(200).json([ ...users ]);
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to retrieve users' });
    }

});

// Добавьте этот код в ваш файл с сервером (например, `app.js` или `server.js`)

// Добавьте этот код в ваш файл с сервером (например, `app.js` или `server.js`)

server.delete('/delete', async (req, res) => {
    const { selectedId } = req.body;
    if (!Array.isArray(selectedId) || selectedId.length === 0) {
        return res.status(400).json({ error: 'No user IDs provided' });
    }

    try {
        // Удалите пользователей из базы данных
        const [result] = await db.execute('DELETE FROM users WHERE id IN (?)', [...selectedId]);
        console.log(result);
        return res.status(200).json({ message: 'Users deleted successfully' });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to delete users' });
    }
});

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});