const express = require('express');
const router = express.Router();
const {User, validate} = require('../module/user');
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/Auth');
 

router.get('/', auth ,async (req, res) => {
   const user = await User.findById(req.user._id).select('-password');
   res.render("users/show");
});


router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('Email is already been registed');

    user = new User(_.pick(req.body, ['userName','email','password','isAdmin']));
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'userName', 'email','isAdmin']));
    // console.log(user);
});

router.get('/create', async (req, res) => {
    res.render("users/create");
});

router.post("/create", async (req, res) => {
    let newUser = req.body;
    console.log(newUser);
   User.create(newUser, (error, user) => {
       if (error) {res.send(error.message)}
       else {
        res.flash("success", `User ${newUser.userName} created successfully`)
        res.render("usres/show");
       }
   });
});


module.exports = router;