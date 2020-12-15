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
}