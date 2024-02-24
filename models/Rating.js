const {Schema, model} = require('mongoose')


const Rating = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    movie: {type: Schema.Types.ObjectId, ref: 'Movie', required: true},
    rating: {type: Number, required: true, min: 0, max: 5}
})

module.exports = model('Rating', Rating)