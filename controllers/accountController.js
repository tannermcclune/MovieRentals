const { User, userVlidate } = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

getUserParams = (body) => {
  return {
    username: body.userName,
    firstname: body.firstName,
    lastname: body.lastName,
    email: body.email,
    password: body.password,
    isAdmin: body.isAdmin,
  };
};

module.exports = {
  login: (req, res) => {
    res.render('login/show', {
      error: undefined,
    });
  },
  users: (req, res) => {
    res.render('users/show');
  },
  members: (req, res) => {
    res.render('members/show');
  },
  create: (req, res) => {
    res.render('users/create', {
      error: undefined,
    });
  },
  createNew: async (req, res) => {
    const { error } = userVlidate(req.body);
    const {
      firstname,
      lastname,
      email,
      password,
      password2,
      username,
    } = req.body;
    const emailError = await User.findOne({ email: email });
    if (error) {
      res.render('users/create', {
        error: error.details[0].message,
      });
    } else {
      if (emailError) {
        res.render('users/create', {
          error: 'The email is already been registed !',
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(req.body.lastname);
        let user = new User({
          username: username,
          firstname: firstname,
          lastname: lastname,
          email: email,
          password: hashedPassword,
        });
        try {
          await user.save();
          req.flash('success', 'You are now registered!');
          res.redirect('/');
        } catch (error) {
          console.log('This is error message :' + error.message);
        }
      }
    }
  },
  userLogin: (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/movies',
      successFlash: true,
      failureRedirect: '/login',
      failureFlash: true,
    })(req, res, next);
  },
  redirect: (req, res) => {
    res.redirect(`${res.locals.redirect}`);
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
    if (res.locals.currentUser && res.locals.currentUser.isAdmin) {
      try {
        let user = await User.findOne({ _id: req.params.id });
        res.locals.user = user;
        res.render('users/singleUser');
      } catch (error) {
        res.send(error.message);
      }
    } else {
      if (!res.locals.currentUser) {
        req.flash("error", "Log in to see this profile");
        res.redirect(`/login`);
      } else if (res.locals.currentUser._id != req.params.id) {
        req.flash("error", "You cannot access this user's information");
        res.redirect(`/users/${res.locals.currentUser._id}`);
      } else {
        try {
          let user = await User.findOne({ _id: req.params.id });
          res.locals.user = user;
          res.render('users/singleUser');
        } catch (error) {
          res.send(error.message);
        }
      }
    }
  },
  editUser: async (req, res, next) => {
      if (res.locals.currentUser && res.locals.currentUser.isAdmin) {
        try {
          let user = await User.findOne({ _id: req.params.id });
          res.locals.user = user;
          res.render('users/singleUser');
        } catch (error) {
          res.send(error.message);
        }
      } else {
        if (!res.locals.currentUser) {
          req.flash("error", "Log in to see this profile");
          res.redirect(`/login`);
        } else if (res.locals.currentUser._id != req.params.id) {
          req.flash("error", "You cannot access this user's information");
          res.redirect(`/users/${res.locals.currentUser._id}`);
        } else {
          try {
            let user = await User.findOne({ _id: req.params.id });
            res.locals.user = user;
            res.render('users/edit');
          } catch (error) {
            res.send(error.message);
          }
        }
      }
  },

  updateUser: async (req, res, next) => {
      if (res.locals.currentUser && res.locals.currentUser.isAdmin) {
        try {
          let user = getUserParams(req.body);
          let updatedUser = await User.findByIdAndUpdate(id, user);
          req.flash('success', `${updatedUser.username} was updated successfully!`);
          res.redirect(`/users/${res.locals.currentUser._id}`);
        } catch (error) {
          req.flash("error", "Could not update user");
          res.send(error.message);
        }
      } else {
        if (!res.locals.currentUser) {
          req.flash("error", "Log in to update a profile");
          res.redirect(`/login`);
        } else if (res.locals.currentUser._id != req.params.id) {
          req.flash("error", "You cannot access this user's information");
          res.redirect(`/users/${res.locals.currentUser._id}`);
        } else {
          try {
            let user = getUserParams(req.body);
            let updatedUser = await User.findByIdAndUpdate(req.params.id, user);
            req.flash('success', `${user.username} was updated successfully!`);
            res.redirect(`/users/${res.locals.currentUser._id}`);
          } catch (error) {
            req.flash("error", "Could not update user");
            res.send(error.message);
          }
        }
      }
  },
  deleteUser: async (req, res, next) => {
    if (res.locals.currentUser && res.locals.currentUser.isAdmin) {
      try {
        let user = getUserParams(req.body);
        let updatedUser = await User.findByIdAndDelete(req.params.id);
        req.flash('success', `User was deleted successfully!`);
        res.redirect(`/`);
      } catch (error) {
        req.flash("error", "Could not delete user");
        res.send(error.message);
      }
    } else {
      if (!res.locals.currentUser) {
        req.flash("error", "Log in to delete a profile");
        res.redirect(`/login`);
      } else if (res.locals.currentUser._id != req.params.id) {
        req.flash("error", "You cannot access this user's information");
        res.redirect(`/users/${res.locals.currentUser._id}`);
      } else {
        try {
          let user = getUserParams(req.body);
          let updatedUser = await User.findByIdAndDelete(req.params.id);
          req.flash('success', `User was deleted successfully!`);
          res.redirect(`/`);
        } catch (error) {
          req.flash("error", "Could not delete user");
          res.send(error.message);
        }
      }
    }
    
  },
  
  userLogout: (req, res, next) => {
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("/");
},
};

