const { User, userVlidate } = require('../models/user');

module.exports = {
    isAdmin: (req, res, next) => {
        if (!res.locals.currentUser || !res.locals.currentUser.isAdmin) {
          req.flash("error", `You are not an administrator.`);
          res.redirect("/login");
        } else {
          next();
        }
    },

    isLoggedIn: (req, res, next) => {
      if (!res.locals.currentUser) {
        res.redirect("/login");
      } else {
        next();
      }
    },

    getAllUsers: async (req, res, next) => {
        try {
          let data = await User.find({});
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

      updateUsers: (req, res, next) => {
        let usersToUpdate = req.body.users;
        for (us of usersToUpdate) {
            if (us.isAdmin === 'on') {
                us.isAdmin = true;
            } else us.isAdmin = false;
            User.findByIdAndUpdate(us._id, {isAdmin: us.isAdmin}, {returnOriginal: false}).then(user => {"Users updated successfully"});
        }
        res.redirect("/admin/users");
      }
}