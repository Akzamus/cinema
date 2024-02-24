const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const User = require('../models/User');

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: "User is not authorized" });
        }

        const decodedToken = jwt.verify(token, JWT_SECRET);
        req.user = decodedToken;

        const user = User.findById(decodedToken.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        next();
    } catch (e) {
        console.error(e);
        return res.status(403).json({ message: "User is not authorized" });
    }
};

