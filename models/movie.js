'use strict';

const mongoose = require('mongoose'),
  { Schema } = require('mongoose');

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    max: [100],
  },

  director: {
    type: String,
    required: true,
    max: [50],
  },

  description: {
    type: String,
    required: true,
    max: [500],
  },

  genre: {
    type: String,
    required: true,
    max: [30],
  },

  imageUrl: {
    type: String,
  },

  runtime: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
