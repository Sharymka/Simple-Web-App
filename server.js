require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const session = require('express-session');
const db = require('./database'); // Путь к вашему файлу конфигурации
const bcrypt = require('bcrypt');
const cors = require('cors');
const {isAuthenticated} = require("./api/src/middlewares/isAuthenticated");
const {registerUser, loginUser, logoutUser, getAllUsers, deleteUsers,  blockUsers, unBlockUsers} = require("./api/src/services/UserService");

const server = express();
// server.use(express.urlencoded({ extended: true }));

server.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false, // Не продолжать preflight запросы после ответа
    optionsSuccessStatus: 204,
}));

server.use(session({
    name: 'express_session_token',
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        // maxAge: 3600000,
        secure: false,
        httpOnly: true,
        sameSite: 'lax'
    }
}));

server.use(express.json());

server.post('/register', async (req, res, next) => {
    try {
        const result = await registerUser(req.body);
        req.session.userId = result.insertId;
        req.session.save(function (err) {
            if (err) return next(err);
            res.status(201).json({ message: 'User registered'});
        })
    } catch (error) {
        return res.status(500).json({ error: 'Registration failed' });
    }
});

server.post('/', async (req, res) => {
    try {
        const user = await loginUser(req.body);
        req.session.userId = user.id;
        req.session.save(function (err) {
            if (err) return next(err);
            res.status(201).json({ message: 'User authorized'});
        })
    } catch (error) {
        return res.status(500).json({ error: 'Authorized failed' });
    }

});

server.post('/logout',isAuthenticated, async (req, res) => {
    try {
        const result = await logoutUser(req.session);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
});



server.get('/users', isAuthenticated, async (req, res) => {
    try {
        const users = await getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to retrieve users' });
    }

});


server.delete('/delete', async (req, res) => {
    const { selectedId } = req.body;
    if (!Array.isArray(selectedId) || selectedId.length === 0) {
        return res.status(400).json({ error: 'No user IDs provided' });
    }
    try {
         await deleteUsers(selectedId);
        return res.status(200).json({ message: 'Users deleted successfully' });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to delete users' });
    }
});

server.put('/block',isAuthenticated, async (req, res) => {
    const { selectedId, status } = req.body;
    if (!Array.isArray(selectedId) || selectedId.length === 0) {
        return res.status(400).json({ error: 'No user IDs provided' });
    }

    try {
        const currentUserId = req.session.userId;
        console.log(selectedId);
        console.log(currentUserId);
        if (selectedId.includes(currentUserId)) {
            await blockUsers(selectedId, status);
            const result = await logoutUser(req.session);

            if (result.success) {
                return res.status(200).json({ message: 'You have been blocked and logged out', redirectTo: '/login' });
            } else {
                return res.status(result.status).json({ error: result.message });
            }
        } else {
            await blockUsers(selectedId, status);
            return res.status(200).json({ message: 'Users blocked successfully' });
        }
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to block users' });
    }
});

server.put('/unBlock', async (req, res) => {
    const { selectedId, status } = req.body;

    if (!Array.isArray(selectedId) || selectedId.length === 0) {
        return res.status(400).json({ error: 'No user IDs provided' });
    }

    try {
        await unBlockUsers(selectedId, status);
        return res.status(200).json({ message: 'Users unBlock successfully' });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to unBlock users' });
    }
});

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});