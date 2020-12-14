const User = require("../models/user"),
    getUserParams = body => {
        return {
            username: body.userName,
            firstname: body.firstName,
            lastname: body.lastName,
            email: body.email,
            password: body.password,
            isAdmin: body.isAdmin
        };
    };


module.exports = {
    login: (req, res) => {
        res.render("login/show")
    },
    users: (req, res) => {
        res.render("users/show")
    },
    members: (req, res) => {
        res.render("members/show")
    },
    create: (req, res) => {
        res.render("users/create")
    },
    createNew: (req, res, next) => {
        let newUser = getUserParams(req.body);
        User.create(newUser, (error, user) => {
            if (error) {
                console.log(error.message);
                console.log(req.body);
                req.flash("error", "COULD NOT CREATE A NEW USER :(");
                res.locals.redirect = "/users/create";
                next();
            } else {
                res.locals.redirect = "/login";
                res.locals.user = user;
                req.flash("success", `User ${user.username} created successfully!`);
                next();
            }
        });
      },
      redirect: (req, res) => {
          res.redirect(`${res.locals.redirect}`);
      },
      getAllUsers: async (req, res, next) => {
          try {
            let data = await User.find();
            res.locals.users = data;
            res.render("users/allUsers");
          } catch (error) {
              res.send(error.message);
          }
      },
      getUser: async (req, res, next) => {
          try {
            let user = await User.findOne({_id: req.params.id});
            res.locals.user = user;
            res.render("users/singleUser");
          } catch (error) {
            res.send(error.message);
          }
      },
      editUser: async (req, res, next) => {
          try {
            let id = req.params.id;
            let user = await User.findById(id);
            res.locals.user = user;
            res.render("users/edit");
          } catch (error) {
              res.send(error.message);
          }
      },
      updateUser: async (req, res, next) => {
          let user = getUserParams(req.body);
          try {
            let updatedUser = await User.findByIdAndUpdate(req.body.id, user);
            req.flash("success", `${user.username} was updated successfully!`);
            res.locals.redirect = "/users/all";
            next();
          } catch (error) {
              req.flash("error", 'Could not update user');
              res.locals.redirect = "/users/all";
                next();
          }
      },
      deleteUser: async (req, res, next) => {
          let username = req.body.username;
          let id = req.params.id;
          try {
            User.findByIdAndDelete(id).then();
            console.log(req.params);
            req.flash("success", `${username} deleted forever`);
            res.locals.redirect = "/users/all";
            next();
          } catch (error) {
              req.flash("error", `${username} could not be deleted`);
              res.locals.redirect = `/users/${id}`;
              next();
          }
      }
  };
