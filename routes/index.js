const mongoose = require('mongoose');
const express = require('express');
const { route } = require('./member');
const router = express.Router();

router.get('/', async (req,res) => {
    res.render("index");
});

module.exports = router;