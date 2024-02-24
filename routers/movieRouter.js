const { Router } = require('express');
const { check, param } = require("express-validator");
const movieController = require('../controllers/movieController');
const roleMiddleware = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

const movieRouter = Router();

const getMovieByIdValidation = [
    param("movieId", "Invalid movie ID").isMongoId()
];

const addMovieValidation = [
    check("title", "Movie title cannot be empty").notEmpty(),
    roleMiddleware(["ADMIN"])
];

const deleteMovieValidation = [
    param("movieId", "Invalid movie ID").isMongoId(),
    roleMiddleware(["ADMIN"])
];

const rateMovieValidation = [
    param("movieId", "Invalid movie ID").isMongoId(),
    check("rating", "Rate must be a number between 1 and 5").isInt({ min: 1, max: 5 }),
    authMiddleware
];

movieRouter.get("", movieController.getMovies)
movieRouter.get("/:movieId", getMovieByIdValidation, movieController.getMovie)
movieRouter.post("", addMovieValidation, movieController.addMovie);
movieRouter.delete("/:movieId", deleteMovieValidation, movieController.deleteMovieById)
movieRouter.post("/:movieId/rate", rateMovieValidation, movieController.rateMovie)

module.exports = movieRouter;