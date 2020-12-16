const { User, userVlidate } = require('../models/user');
const stripe = require('stripe')('sk_test_51HwKCmEh7sPHHFlBmTm7SQrKsec0tOPYmFgIpqOu0byDrq5WjcWG1cR2qf8LoARJTdubkEXUIU8IpUlC77L67uKI00XujMmqVS');
const Transaction = require('../models/transaction');
const dateFormat = require("dateformat");

module.exports = {

    getRentalPage: async (req, res, next) => {
        let id = req.params.id;
        try {
            let transaction = await Transaction.findById(id);
            res.locals.transaction = transaction;
            console.log(transaction);
            res.render('rentals/rentals-page');
        } catch (error) {
            req.flash('error', 'There was an error getting the movie');
            res.redirect('/rentals');
        }
    },

    getRentalWatchPage: async (req, res, next) => {
        let id = req.params.id;
        try {
            let transaction = await Transaction.findById(id);
            res.locals.transaction = transaction;
            console.log(transaction);
            res.render('rentals/rentals-watch');
        } catch (error) {
            req.flash('error', 'There was an error getting the movie');
            res.redirect('/rentals');
        }
    }

}