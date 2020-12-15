"use strict";

const mongoose = require("mongoose"),
  { Schema } = require("mongoose");

const transSchema = new Schema(
    {
        purchaseDate: {
            type: Date,
            default: new Date()
        },

        movieTitle: {
            type: String
        },

        movieDirector: {
            type: String
        },

        moviePrice: {
            type: Number
        }
    }
)

module.exports = mongoose.model("transaction", transSchema, "transactions");