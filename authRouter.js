const { Router } = require('express');
const { check, validationResult } = require("express-validator");
const controller = require('./controllers/authController');
const roleMiddleware = require('./middleware/roleMiddleware');

const router = Router();

const registrationValidation = [
    check('username', "Username cannot be empty").notEmpty(),
    check('password', "Password must be between 4 and 10 characters").isLength({ min: 4, max: 10 }),
];

router.post('/registration', registrationValidation, controller.registration);
router.post('/login', controller.login);
router.get('/users', roleMiddleware(["ADMIN"]), controller.getUsers);

module.exports = router;