const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('./genre');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 255,
        minlength: 5
    },
    genre: {
        type:genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        max: 255,
        min: 0
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        max: 255,
        min: 0
    }
});

movieSchema.index({ title: 'text'});

const Movie = mongoose.model('Movies', movieSchema);

function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(5).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    }
    return Joi.validate(movie, schema);
}

module.exports.validate = validateMovie,
module.exports.Movie = Movie,
module.exports.movieSchema = movieSchema


