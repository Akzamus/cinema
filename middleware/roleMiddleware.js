const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const User = require('../models/User');

module.exports = function (roles) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next();
        }

        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(403).json({ message: "User is not authorized" });
            }

            const { id, roles: userRoles } = jwt.verify(token, JWT_SECRET);

            const user = User.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            let hasRole = false;
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true;
                }
            });

            if (!hasRole) {
                return res.status(403).json({ message: "Access denied" });
            }

            next();
        } catch (e) {
            console.log(e);
            return res.status(403).json({ message: "User is not authorized" });
        }
    };
};
