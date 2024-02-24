const { Router } = require('express');
const { check, validationResult } = require("express-validator");
const movieController = require('../controllers/movieController');
const roleMiddleware = require('../middleware/roleMiddleware');

const movieRouter = Router();

const addMovieValidation = [
    check("movieName", "Movie name cannot be empty").notEmpty(),
    roleMiddleware(["ADMIN"])
];

movieRouter.post("", addMovieValidation, movieController.addMovie);

module.exports = movieRouter;