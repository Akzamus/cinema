const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { JWT_SECRET } = require("../config");

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

class AuthController {

    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Registration error", errors });
            }
            const { username, password } = req.body;
            const candidate = await User.findOne({ username });
            if (candidate) {
                return res.status(400).json({ message: "User with this username already exists" });
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({ value: "USER" });
            const user = new User({ username, password: hashPassword, roles: [userRole.value] });
            await user.save();
            return res.status(201).json({ message: "User successfully registered" });
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: "Registration error" });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: `User ${username} not found` });
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: "Incorrect password" });
            }
            const token = generateAccessToken(user._id, user.roles);
            return res.status(200).json({ token });
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: "Login error" });
        }
    }

}

module.exports = new AuthController();

