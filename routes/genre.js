const mongoose = require('mongoose');
const express = require('express');
const { route } = require('./member');
const router = express.Router();
const {Genre,validateGenre,genreSchema} = require('../module/genre');
const auth = require('../middleware/Auth');
const admin = require('../middleware/admin');

router.get('/', async (req,res) => {
    const genre = await Genre.find().sort('name');
    if (!genre) return res.status(404).send('Genre is not find');
    res.locals.genres = genre;
    res.render("genres/show");
});

router.post('/', auth, async(req, res) => {
     const result = validateGenre(req.body);
     if (result.error) return res.status(400).send(result.error.details[0].message);
     let genre = new Genre({
        name: req.body.name
     })

     genre = await genre.save();
     const genreList = await Genre.find().sort('name');
     res.send(genreList);
})

router.put('/:id', async(req, res) => {
    const {error} = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {
        new: true
    });
    if(!genre) return res.send('The genre you are looking for does not exist');
    res.send(genre);
})

router.delete('/:id', auth, admin, async (req,res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send('The genre you looking for was not found');
    res.send(genre);
});

module.exports = router;