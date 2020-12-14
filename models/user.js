"use strict";

const mongoose = require("mongoose"),
  { Schema } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      max: [30]
    },

    isAdmin: {
      type: Boolean,
      required: true
    },

    firstname: {
      type: String,
      required: true,
      max: [30]
    },

    lastname: {
      type: String,
      required: true,
      max: [30]
    },

    email: {
      type: String,
      required: true,
      unique: true,
      max: [55]
    },
    password: {
      type: String,
      required: true,
      min: 5
    },

    myMovies: {
      type: Array
    },

    myFriends: {
      type: Array
    }
  }
);

module.exports = mongoose.model("user", userSchema);