const User = require("../models/user");

module.exports = {
    isAdmin: (req, res, next) => {
        if (currentUser.isAdmin) {
            next();
        } else {
            req.flash("error", `You are not an administrator.`);
            res.redirect("/");
        }
    },

    getAllUsers: async (req, res, next) => {
        try {
          let data = await User.find();
          res.locals.users = data;
          res.render('users/allUsers');
        } catch (error) {
          res.send(error.message);
        }
      },

      getUser: async (req, res, next) => {
        try {
          let user = await User.findOne({ _id: req.params.id });
          res.locals.user = user;
          res.render('users/singleUser');
        } catch (error) {
          res.send(error.message);
        }
      },
}