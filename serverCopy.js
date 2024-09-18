require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const server = express();
const db = require('./database'); // Путь к вашему файлу конфигурации
const bcrypt = require('bcrypt');
const cors = require('cors');
const {generateToken, verifyToken} = require("./api/src/utils/jwService");


server.use(cors());
server.use(express.json());

server.get('/', (req, res) => {
    res.send('Hello, World!');
});

server.get('/api/test', (req, res) => {
    res.json({ message: 'Тестовый ответ от сервера!' });
});

server.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [result] = await db.execute('INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)', [firstName, lastName, email, hashedPassword ]);
        const userId = result.insertId;
        const token = generateToken({ id: userId, username: email });

        return res.status(201).json({ message: 'User registered', token: token });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Registration failed' });
    }
});

server.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);  // No token

    verifyToken();

    try {
        // Найти пользователя по email
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Проверить правильность пароля
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Создать токен
        const token = generateToken();

        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});


// Пример получения токена и его сохранения в localStorage
const handleLogin = async () => {
    const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('authToken', token);
    } else {
        // Обработка ошибки
    }
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    try {
        const user = verifyToken(token); // Используем вашу функцию для проверки токена
        req.user = user;
        next();
    } catch (error) {
        res.sendStatus(403); // Неверный токен
    }
};
// server.get('/users', authenticateToken, async (req, res) => {
//     try {
//         const [rows] = await db.execute('SELECT id, firstName, lastName, email, status FROM users');
//         res.json(rows);
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ error: 'Failed to retrieve users' });
//     }
// });


server.listen(3001, () => {
    console.log('Server is running on port 3001');
});