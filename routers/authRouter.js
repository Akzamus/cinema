const { Router } = require('express');
const { check, validationResult } = require("express-validator");
const authController = require('../controllers/authController');

const authRouter = Router();

const registrationValidation = [
    check("username", "Username cannot be empty").notEmpty(),
    check("password", "Password must be between 4 and 10 characters").isLength({ min: 4, max: 10 }),
];

authRouter.post("/registration", registrationValidation, authController.registration);
authRouter.post("/login", authController.login);

module.exports = authRouter;