module.exports = {
    isAuthenticated: (req, res, next) => {
        // Your authentication logic here
        if (req.session.userId) {
            console.log('userId', req.session.userId);
            return next();
        } else {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
};
