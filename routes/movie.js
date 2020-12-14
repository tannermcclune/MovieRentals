const express = require('express');
const { valid } = require('joi');
const router = express.Router();
const {Movie, validate} = require('../module/movie');
const {Genre} = require('../module/genre');

router.get('/', async(req, res) => {
    const movies = await Movie.find().sort('name');
    res.locals.movies = movies;
    res.render("movies/show");
});

router.post('/', async(req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error);
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send('Genre is not find');
    const movie = new Movie({
        title: req.body.title,
        genre: {
            id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.numberInStock
    });

    await movie.save();
    res.send(movie);
});

router.put('/:id' , async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error);
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send('Genre not find');
    await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre : {
            id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, {new: true});
    res.send(await Movie.find());
});

router.delete('/:id', async (req,res) => {
    const resoult = await Movie.findByIdAndRemove(req.params.id);
    if (!resoult) return res.status(404).send('The Movie you are looking for is not find');
    res.send(await Movie.find());
})






module.exports = router;