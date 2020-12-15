const { User, userVlidate } = require('../models/user');
const stripe = require('stripe')('sk_test_51HwKCmEh7sPHHFlBmTm7SQrKsec0tOPYmFgIpqOu0byDrq5WjcWG1cR2qf8LoARJTdubkEXUIU8IpUlC77L67uKI00XujMmqVS');

module.exports = {
    addTransaction: (req, res) => {
        res.send("it works");
    },
    
    intiateCheckout: async (req, res) => {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
              {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: 'Stubborn Attachments',
                  },
                  unit_amount: 2000,
                },
                quantity: 1,
              },
            ],
            mode: 'payment',
            success_url: `/transactions/success`,
            cancel_url: `/transactions/cancel`,
          });
          res.json({ id: session.id });
    }
}