const { Router } = require('express');
const { check, param } = require("express-validator");
const movieController = require('../controllers/movieController');
const roleMiddleware = require('../middleware/roleMiddleware');

const movieRouter = Router();

const addMovieValidation = [
    check("movieName", "Movie name cannot be empty").notEmpty(),
    roleMiddleware(["ADMIN"])
];

const deleteMovieValidation = [
    param("movieId", "Invalid movie ID").isMongoId(),
    roleMiddleware(["ADMIN"])
];

movieRouter.post("", addMovieValidation, movieController.addMovie);
movieRouter.get("", movieController.getMovies)
movieRouter.delete("/:movieId", deleteMovieValidation, movieController.deleteMovieById)

module.exports = movieRouter;