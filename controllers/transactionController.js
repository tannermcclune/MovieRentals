const { User, userVlidate } = require('../models/user');
const stripe = require('stripe')('sk_test_51HwKCmEh7sPHHFlBmTm7SQrKsec0tOPYmFgIpqOu0byDrq5WjcWG1cR2qf8LoARJTdubkEXUIU8IpUlC77L67uKI00XujMmqVS');
const Transaction = require('../models/transaction');

const getTransParams = (req, body) => {
    return{
      movieTitle: body.title,
      movieDirector: body.director,
      moviePrice: body.price,
      userPurchased: req.user.username
    };
};

module.exports = {

    addTransaction: async (req, res) => {
      const movieTitle = req.body.title,
            movieDirector = req.body.director,
            moviePrice = req.body.price,
            userPurchased = req.user.username;

      const newTrans = new Transaction({
          movieTitle,
          movieDirector,
          moviePrice,
          userPurchased
      });

      Transaction.create(newTrans);
      console.log(newTrans);
      res.send("it works");
    },

    getAdminTransactions: (req, res, next) => {
      Transaction.find()
      .then(transactions => {
        res.locals.transactions = transactions;
        res.render("transactions/admin-transactions");
      })
      .catch(error => {
        req.flash("error", "Couldn't get transactions");
        console.log("Can't get transactions!")
        next(error);
      });
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