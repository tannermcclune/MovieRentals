'use strict';

const { join } = require('lodash');
const mongoose = require('mongoose'),
  Joi = require('joi'),
  { Schema } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    max: [30],
  },

  isAdmin: {
    type: Boolean,
    default: false,
    required: true,
  },

  firstname: {
    type: String,
    required: true,
    max: [30],
  },

  lastname: {
    type: String,
    required: true,
    max: [30],
  },

  email: {
    type: String,
    required: true,
    unique: true,
    max: [55],
  },
  password: {
    type: String,
    required: true,
    min: 5,
  },

  myMovies: {
    type: Array,
  },

  myFriends: {
    type: Array,
  },
});

const User = mongoose.model('Users', userSchema);

const userVlidate = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(5).required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().min(5).email(),
    password: Joi.string().min(1).required(),
    password2: Joi.ref('password'),
    isAdmin: Joi.boolean().required(),
  });
  return schema.validate(user);
};

module.exports.User = User;
module.exports.userVlidate = userVlidate;
