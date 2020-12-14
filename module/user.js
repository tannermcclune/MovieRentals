const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type:String,
        required:true,
        unique:true,
        minlength:5,
        maxlength:255
    },
    password: {
        type:String,
        required:true,
        minlength:5,
        maxlength:1025
    },

    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('Users', userSchema);

function validate (user) {
    const schema = {
        userName: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        isAdmin: Joi.boolean()
    };
    return Joi.validate(user, schema);
}

exports.validate = validate;
exports.User = User;
exports.userSchema = userSchema;