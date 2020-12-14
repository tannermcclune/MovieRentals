const Joi = require('joi');
const mongoose = require('mongoose');
// Joi.objectId = require('joi-objectid')(Joi);
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isPrimium : {
        type: Boolean,
        required:true,
        default: false
    }
});

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength:5,
        maxlength: 255
    },
    dailyRentalRate:{
        type: Number,
        required:true,
        min:0,
        max:255
    },
})


const rentalSchema = new mongoose.Schema({
    customer: {
        type: customerSchema,
        required: true
    },
    movie: {
        type: movieSchema,
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturn: {
        type: Date,    
    },
    rentalFee: {
        type:Number,
        min:0
    }
});

const Rental = mongoose.model('rentalInfo', rentalSchema);

function validateRental (rentalInfo) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    }
    return Joi.validate(rentalInfo, schema);
}

module.exports.validate = validateRental;
module.exports.Rental = Rental;