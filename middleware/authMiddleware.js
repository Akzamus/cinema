const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: "User is not authorized" });
        }
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (e) {
        console.error(e);
        return res.status(403).json({ message: "User is not authorized" });
    }
};

