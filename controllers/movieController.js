const User = require('../models/User');
const Movie = require('../models/Movie');
const Rating = require('../models/Rating');
const tmdbApi = require('../api/tmdbApi')
const { validationResult } = require('express-validator');
const { TMDB_API_KEY } = require("../config");


class MovieController {

    async addMovie(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Failed to add movie", errors });
            }
            const { movieName } = req.body
            const movieId = await tmdbApi.getFirstMovieIdByName(movieName);
            const movieInfo = await tmdbApi.getMovieInfoById(movieId);
            const trailerUrl = await tmdbApi.getMovieTrailerUrlByMovieId(movieId);

            const movie = new Movie({ ...movieInfo, trailerUrl });
            await movie.save();

            return res.status(201).json({ message: 'Movie added', movie });
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: e.message });
        }
    }

}

module.exports = new MovieController();