const fetch = require('node-fetch');
const { TMDB_API_KEY } = require("../config");
const {json} = require("express");

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

    async getFirstMovieIdByName(name) {
        const url = `${this.baseUrl}/search/movie?query=${name}&language=en-US&page=1`;
        const response = await fetch(url, this.options);
        if (!response.ok) {
            throw new Error('Failed to fetch movie data');
        }
        const results = await response.json().results;
        if (results.length === 0) {
            throw new Error('Movie not found');
        }
        return results[0].id;
    }

    async getMovieInfoById(movieId) {
        const url = `${this.baseUrl}/movie/${movieId}?language=en-US`;
        const response = await fetch(url, this.options);
        if (!response.ok) {
            throw new Error('Failed to fetch movie data');
        }
        const json = await response.json();
        return {
            title: json["original_title"],
            description: json["overview"],
            posterUrl: `https://image.tmdb.org/t/p/{IMAGE_WIDTH}${json["poster_path"]}`,
            releaseDate: new Date(json["release_date"]),
        }
    }

    async getMovieTrailerUrlByMovieId(movieId) {
        const url = `${this.baseUrl}/movie/${movieId}/videos?language=en-US`;
        const response = await fetch(url, this.options);
        if (!response.ok) {
            throw new Error('Failed to fetch movie trailer data');
        }
        const json = await response.json();
        if (json.results.length === 0) {
            return null
        }
        const key = json.results[0].key;
        return `https://www.youtube.com/watch?v=${key}`;
    }
}

module.exports = new TmdbApi(TMDB_API_KEY);