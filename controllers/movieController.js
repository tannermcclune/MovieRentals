const { update } = require('../models/movie');

const Movie = require('../models/movie'),
  axios = require('axios').default,
  getMovieParams = (body) => {
    return {
      title: body.title,
      director: body.director,
      description: body.description,
      genre: body.genre,
      runtime: body.runtime,
      price: body.price,
      imageUrl: body.imageUrl,
    };
  };

module.exports = {
  genres: (req, res) => {
    res.render('genres/show');
  },

  rentals: (req, res) => {
    res.render('rentals/rentals');
  },

  moviesShow: async (req, res) => {
    // let movies = await Movie.
    res.locals.movies = movies;
    res.render('movies/show');
  },

  movies: (req, res, next) => {
    Movie.find()
      .then((movies) => {
        res.locals.movies = movies;
        res.render('movies/show');
      })
      .catch((error) => {
        req.flash('error', "Couldn't get movies");
        console.log("Can't get movies!");
        next(error);
      });
  },

  new: async (req, res, next) => {
    res.render('movies/newMovie');
  },

  redirect: (req, res) => {
    res.redirect(res.locals.redirect);
  },

  createNew: async (req, res, next) => {
    let newMovie = getMovieParams(req.body);
    // console.log(newMovie);
    try {
      Movie.create(newMovie);
      req.flash('success', `Movie "${newMovie.title}" created successfully!`);
      res.locals.redirect = '/movies';
      next();
    } catch (error) {
      req.flash('error', 'There was an error creating the movie');
      console.log(error.message);
      res.locals.redirect = '/movies/new';
    }
  },

  getMovie: async (req, res, next) => {
    let id = req.params.id;
    try {
      let movie = await Movie.findById(id);
      res.locals.movie = movie;
      let image = await (
        await axios.get('https://dog.ceo/api/breeds/image/random')
      ).data.message;
      res.locals.image = image;
      console.log(movie);
      res.render('movies/singleMovie');
    } catch (error) {
      req.flash('error', 'There was an error getting the movie');
      res.redirect('/movies');
    }
  },

  edit: async (req, res) => {
    let id = req.params.id;
    try {
      let movie = await Movie.findById(id);
      res.locals.movie = movie;
      res.render('movies/edit');
    } catch (error) {
      req.flash('error', "couldn't find the movie");
      console.log(error.message);
      res.redirect(`/movies/${id}`);
    }
  },

  updateMovie: async (req, res, next) => {
    let id = req.params.id;
    let updatedMovie = getMovieParams(req.body);
    try {
      let movie = await Movie.findByIdAndUpdate(id, updatedMovie).then();
      req.flash('success', `${movie.title} updated successfully!`);
      res.locals.redirect = `/movies/${id}`;
      next();
    } catch (error) {
      req.flash('error', "Couldn't update the movie");
      console.log(error.message);
      res.redirect(`/movies/${id}`);
      next();
    }
  },
  deleteMovie: (req, res, next) => {
    let id = req.params.id;
    let title = req.body.title;
    Movie.deleteOne({ _id: id })
      .then((thing) => {
        req.flash('success', `${title} successfully deleted!`);
        res.locals.redirect = '/movies';
        next();
      })
      .catch((error) => {
        console.log(error.message);
        req.flash('error', 'Error occurred, could not delete movie');
        res.locals.redirect = `/movies/${id}`;
        next();
      });
  },

  searchMovies: async (req, res, next) => {
    let phrase = req.body.search;
    let query = { $text: { $search: 'Children' } };

    try {
      let indexes = await Movie.listIndexes();
      console.log(indexes);
      let moviesMatched = await Movie.find(query);
      res.send(moviesMatched);
    } catch (error) {
      console.log('ERROR');
      res.send(error);
    }
  },

  getCheckout: async (req, res, next) => {
    let id = req.params.id;
    try {
      let movie = await Movie.findById(id);
      res.locals.movie = movie;
      res.render('movies/checkout');
    } catch (error) {
      req.flash('error', 'There was an error checking out');
      res.redirect('/movies');
    }
  },
};
