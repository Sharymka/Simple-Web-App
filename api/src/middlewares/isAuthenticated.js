module.exports = {
    isAuthenticated: (req, res, next) => {
        console.log("session in isAuthenticated", req.session.userId);
        if (req.session.userId) {
            return next();
        }

        return res.status(401).json({ error: 'Unauthorized' });
    }
};
