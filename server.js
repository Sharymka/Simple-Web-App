require('dotenv/config');
const path = require('path');
const express = require('express');
const morgan = require('morgan')
const session = require('express-session');
const cors = require('cors');
const {isAuthenticated} = require("./api/src/middlewares/isAuthenticated");
const {UserService, UserError} = require("./api/src/services/UserService");

const server = express();

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

const api = express.Router();

api.use(morgan('tiny'));
api.use(express.json());
api.post('/register', async (req, res, next) => {
    try {
        const result = await UserService.registerUser(req.body);
        req.session.userId = result.insertId;
        req.session.save(function (err) {
            if (err) return next(err);
            res.status(201).json({ message: 'User registered'});
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Registration failed' });
    }
});

api.post('/login', async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ error: 'Email and password is required' });
    }

    try {
        const user = await UserService.loginUser(req.body);
        req.session.userId = user.id;
        req.session.save(function (err) {
            if (err) return next(err);
            res.status(201).json({ message: 'User authorized'});
        })
    } catch (error) {
        if (error instanceof UserError) {
            return res.status(422).json({ error: error.message });
        }

        return res.status(500).json({ error: 'Authorized failed' });
    }

});

api.post('/logout',isAuthenticated, async (req, res) => {
    try {
        const result = await UserService.logoutUser(req.session);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
});

api.get('/users', isAuthenticated, async (req, res) => {
    try {
        console.log('Request users!')
        const users = await UserService.getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to retrieve users' });
    }

});

api.delete('/delete', isAuthenticated, async (req, res) => {
    const { selectedId } = req.body;
    console.log({
        selectedId,
        type: typeof selectedId,
    })
    if (!Array.isArray(selectedId) || selectedId.length === 0) {
        return res.status(400).json({ error: 'No user IDs provided' });
    }
    try {
         await UserService.deleteUsers(selectedId);
        return res.status(200).json({ message: 'Users deleted successfully' });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to delete users' });
    }
});

api.put('/block',isAuthenticated, async (req, res) => {
    const { selectedId, status } = req.body;
    if (!Array.isArray(selectedId) || selectedId.length === 0) {
        return res.status(400).json({ error: 'No user IDs provided' });
    }

    try {
        const currentUserId = req.session.userId;
        console.log(selectedId);
        console.log(currentUserId);
        if (selectedId.includes(currentUserId)) {
            await UserService.blockUsers(selectedId, status);
            const result = await UserService.logoutUser(req.session);

            if (result.success) {
                return res.status(200).json({ message: 'You have been blocked and logged out', redirectTo: '/login' });
            } else {
                return res.status(result.status).json({ error: result.message });
            }
        } else {
            await UserService.blockUsers(selectedId, status);
            return res.status(200).json({ message: 'Users blocked successfully' });
        }
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to block users' });
    }
});

api.put('/unblock', async (req, res) => {
    const { selectedId, status } = req.body;

    if (!Array.isArray(selectedId) || selectedId.length === 0) {
        return res.status(400).json({ error: 'No user IDs provided' });
    }

    try {
        await UserService.unBlockUsers(selectedId, status);
        return res.status(200).json({ message: 'Users unBlock successfully' });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to unBlock users' });
    }
});

server.use('/api', api);

server.use(express.static(path.join(__dirname, 'web/build')));
server.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'web/build', 'index.html'));
});

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});