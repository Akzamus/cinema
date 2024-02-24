const {Schema, model} = require('mongoose')


const Movie = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    posterUrl: {type: String, required: true},
    trailerUrl: {type: String, required: false},
    releaseDate: {type: Date, required: true},
    averageRating: {type: Number, default: 0, min: 0, max: 5}
})

module.exports = model('Movie', Movie)