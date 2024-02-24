const Movie = require('../models/Movie');
const Rating = require('../models/Rating');
const tmdbApi = require('../api/tmdbApi')
const {validationResult} = require('express-validator');

const handleValidationErrors = (req, res, message) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({message: message, errors});
    }
    return null;
}

class MovieController {

    async getMovies(req, res) {
        try {
            const {searchTitle} = req.query;
            let query = {};

            if (searchTitle) {
                const regex = new RegExp(searchTitle, "i");
                query = {title: regex};
            }

            const movies = await Movie.find(query, {__v: 0, trailerUrl: 0, description: 0});
            return res.status(200).json(movies)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Failed to get movies"});
        }
    }

    async getMovie(req, res) {
        try {
            const validationError = await handleValidationErrors(req, res, "Failed to get movie");
            if (validationError) return validationError;

            const {movieId} = req.params;
            const movie = await Movie.findById(movieId, {__v: 0})

            return res.status(200).json(movie)
        } catch (e) {
            console.log(e)
            return res.status(500).json({error: "Failed to get movie"});
        }
    }

    async addMovie(req, res) {
        try {
            const validationError = await handleValidationErrors(req, res, "Failed to add movie");
            if (validationError) return validationError;

            const {title} = req.body

            const movieId = await tmdbApi.getFirstMovieIdByTitle(title);
            const movieInfo = await tmdbApi.getMovieInfoById(movieId);
            const trailerUrl = await tmdbApi.getMovieTrailerUrlByMovieId(movieId);

            const movie = new Movie({...movieInfo, trailerUrl});
            await movie.save();

            return res.status(201).json({message: "Movie added", movie});
        } catch (e) {
            console.log(e);
            return res.status(500).json({error: "Failed to add movie"});
        }
    }

    async deleteMovieById(req, res) {
        try {
            const validationError = await handleValidationErrors(req, res, "Failed to delete movie");
            if (validationError) return validationError;

            const {movieId} = req.params;
            const deletedMovie = await Movie.findByIdAndDelete(movieId);

            if (!deletedMovie) {
                return res.status(404).json({message: "Movie not found"});
            }

            return res.status(200).json({message: "Movie deleted", title: deletedMovie.title});
        } catch (e) {
            console.log(e)
            return res.status(500).json({error: "Failed to delete movie"});
        }
    }

    async rateMovie(req, res) {
        try {
            const validationError = await handleValidationErrors(req, res, "Failed to rate movie");
            if (validationError) return validationError;

            const {movieId} = req.params;
            const {rating} = req.body;
            const userId = req.user.id;

            const movie = await Movie.findById(movieId);
            if (!movie) {
                return res.status(404).json({message: "Movie not found"});
            }

            let userRating = await Rating.findOne({user: userId, movie: movieId});
            if (userRating) {
                if (userRating.rating === rating) {
                    return res.status(200).json({message: "Movie rated successfully"});
                }
                userRating.rating = rating;
                await userRating.save();
            } else {
                userRating = new Rating({user: userId, movie: movieId, rating});
                await userRating.save();
            }

            const ratings = await Rating.find({movie: movieId});
            const totalRatings = ratings.length;
            const totalRatingSum = ratings.reduce((acc, cur) => acc + cur.rating, 0);
            movie.averageRating = totalRatingSum / totalRatings;
            await movie.save();

            return res.status(200).json({message: "Movie rated successfully"});
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: "Failed to rate movie"});
        }
    }

}

module.exports = new MovieController();