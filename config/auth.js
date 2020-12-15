const passportLocal = require('passport-local');
const bcrypt = require('bcrypt');
const LocalStrategy = passportLocal.Strategy;
const { User } = require('../models/user');

const passportConfig = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      //Match User
      User.findOne({ email: email })
        .then((user) => {
          if (!user)
            return done(null, false, { message: 'Email is not registered!' });
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch)
              return done(null, user, {
                message: `Logged in as ${user.username}`,
              });
            done(null, false, { message: 'Password not match' });
          });
        })
        .catch((error) => console.log(error));
    })
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};

module.exports = passportConfig;
