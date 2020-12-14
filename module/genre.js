const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
        maxlength: 255,
        minlength: 5
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre (genre) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema);
}

module.exports.validateGenre = validateGenre;
module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;