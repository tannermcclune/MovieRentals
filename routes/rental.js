const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const {Rental, validate} = require('../module/rental');
const {Member} = require('../module/member');
const {Movie} = require('../module/movie');

Fawn.init(mongoose);

router.get('/', async(req, res) => {
    const result = await Rental.find().sort('name');
    res.locals.rentals = result;
    res.render("rentals/rentals");
});

router.post('/', async(req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const customer = await Member.findById(req.body.customerId);
    if (!customer) return res.status(404).send('The customer you were looking for is not find');
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) await res.status(404).send('The movie you were looking for is not find');    
    if (movie.numberInStock === 0) return res.send('The movie is not avaliable right now');
    
    let rentalInfo = new Rental({
        customer: {
            _id : customer._id,
           name: customer.name,
           phoneNumber: customer.phoneNumber,
           isPrimium : customer.isPremium
        },
        movie:{
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
            genre: movie.genre.name
        }
    });
    try {
        new Fawn.Task()
            .save('rentalinfo',rentalInfo)
            .update('movies', {_id: movie._id}, {$inc:{numberInStock: -1} })
            .run();
        res.send(rentalInfo);
    }

    catch (ex) {
        res.status(500).send('We are experice some tech issue now');
    }
});

router.delete('/:id', async (req,res) => {
    const resoult = await Rental.findByIdAndRemove(req.params.id);
    if (!resoult) return res.status(404).send('The rental info is not find');
    res.send(await Rental.find());
});

// router.put('/:id', async(req, res) => {
//     const {error} = validate(req.body);
//     if (error) return res.status(400).send(error.details[0].message);
//     const customer = await Member.findById(req.body.customerId);
//     if (!customer) return res.status(404).send('The customer you were looking for is not exist');
//     const movie = await Movie.findById(req.body.movieId);
//     if (!movie) return res.status(404).send('The movie you are looking for is not find');
//     if (movie.numberInStock === 0) return res.send('Out of stock!');
    
//     const rental = await Rental.findByIdAndUpdate(req.params.id, {
//         customer: {
//             _id : customer._id,
//            name: customer.name,
//            phoneNumber: customer.phoneNumber,
//            isPrimium : customer.isPremium
//         },
//         movie:{
//             _id: movie._id,
//             title: movie.title,
//             dailyRentalRate: movie.dailyRentalRate,
//             genre: movie.genre.name
//         }
//     }, {new: true});
//     res.send(rental);
//     console.log(rental);
// })
module.exports = router;