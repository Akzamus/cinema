const fetch = require('node-fetch');
const {TMDB_API_KEY} = require("../config");


class TmdbApi {

    constructor(apiKey) {
        this.apiKey = apiKey;
        this.options = {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            }
        };
        this.baseUrl = 'https://api.themoviedb.org/3';
    }

    async getFirstMovieIdByTitle(title) {
        const url = `${this.baseUrl}/search/movie?query=${title}&language=en-US&page=1`;
        const response = await fetch(url, this.options);
        if (!response.ok) {
            throw new Error('Failed to fetch movie data');
        }
        const jsonData = await response.json();
        if (jsonData.results.length === 0) {
            throw new Error('Movie not found');
        }
        return jsonData.results[0].id;
    }

    async getMovieInfoById(movieId) {
        const url = `${this.baseUrl}/movie/${movieId}?language=en-US`;
        const response = await fetch(url, this.options);
        if (!response.ok) {
            throw new Error('Failed to fetch movie data');
        }
        const jsonData = await response.json();
        return {
            title: jsonData.original_title,
            description: jsonData.overview,
            posterUrl: `https://image.tmdb.org/t/p/{IMAGE_WIDTH}${jsonData.poster_path}`,
            releaseDate: new Date(jsonData.release_date),
        }
    }

    async getMovieTrailerUrlByMovieId(movieId) {
        const url = `${this.baseUrl}/movie/${movieId}/videos?language=en-US`;
        const response = await fetch(url, this.options);
        if (!response.ok) {
            throw new Error('Failed to fetch movie trailer data');
        }
        const jsonData = await response.json();
        if (jsonData.results.length === 0) {
            return null;
        }
        const key = jsonData.results[0].key;
        return `https://www.youtube.com/watch?v=${key}`;
    }

}

module.exports = new TmdbApi(TMDB_API_KEY);