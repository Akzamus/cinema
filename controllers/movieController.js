const User = require('../models/User');
const Movie = require('../models/Movie');
const Rating = require('../models/Rating');
const tmdbApi = require('../api/tmdbApi')
const {validationResult} = require('express-validator');


class MovieController {

    async addMovie(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Failed to add movie", errors});
            }
            const {movieName} = req.body
            const movieId = await tmdbApi.getFirstMovieIdByName(movieName);
            const movieInfo = await tmdbApi.getMovieInfoById(movieId);
            const trailerUrl = await tmdbApi.getMovieTrailerUrlByMovieId(movieId);

            const movie = new Movie({...movieInfo, trailerUrl});
            await movie.save();

            return res.status(201).json({message: 'Movie added', movie});
        } catch (e) {
            console.log(e);
            return res.status(400).json({message: e.message});
        }
    }

    async getMovies(req, res) {
        try {
            const movies = await Movie.find({}, {__v: 0, trailerUrl: 0, description: 0});
            res.status(200).json(movies)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Failed to fetch movies"});
        }
    }

    async deleteMovieById(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Failed to delete movie", errors});
            }
            const {movieId} = req.params;
            const deletedMovie = await Movie.findByIdAndDelete(movieId);
            if (!deletedMovie) {
                return res.status(404).json({message: 'Movie not found'});
            }
            res.status(200).json({message: 'Movie deleted', deletedMovieName: deletedMovie.title});
        } catch (e) {
            console.log(e)
            res.status(500).json({error: 'Failed to delete movie'});
        }
    }

}

module.exports = new MovieController();