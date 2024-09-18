
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const payload = { id: user.id, username: user.username };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '1h' };

    return jwt.sign(payload, secret, options);
};

const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET;

    try {
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

module.exports = { generateToken, verifyToken };
