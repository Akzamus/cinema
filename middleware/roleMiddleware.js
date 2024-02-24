const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

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
            const { roles: userRoles } = jwt.verify(token, JWT_SECRET);
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
