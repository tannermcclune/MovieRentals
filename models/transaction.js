"use strict";

const mongoose = require("mongoose"),
  { Schema } = require("mongoose");

const transSchema = new Schema(
    {
        purchaseDate: {
            type: Date,
            default: new Date()
        },

        userPurchased: {
            type: String
        },

        movieTitle: {
            type: String
        },

        movieDirector: {
            type: String
        },

        moviePrice: {
            type: String
        },

        genre: {
            type: String,
          },
        
        imageUrl: {
            type: String,
        },
        
        runtime: {
            type: Number,
        }

    }
)

module.exports = mongoose.model("transaction", transSchema, "transactions");