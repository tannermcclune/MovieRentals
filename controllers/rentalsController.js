const { User, userVlidate } = require('../models/user');
const stripe = require('stripe')('sk_test_51HwKCmEh7sPHHFlBmTm7SQrKsec0tOPYmFgIpqOu0byDrq5WjcWG1cR2qf8LoARJTdubkEXUIU8IpUlC77L67uKI00XujMmqVS');
const Transaction = require('../models/transaction');
const dateFormat = require("dateformat");

module.exports = {

    getRentalPage: (req, res) => {
        
    }

}