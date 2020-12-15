const express = require('express'),
  layouts = require('express-ejs-layouts'),
  router = express.Router(),
  app = express(),
  mongoose = require('mongoose'),
  Joi = require('joi'),
  expressSession = require('express-session'),
  connectFlash = require('connect-flash'),
  cookieParser = require('cookie-parser'),
  passport = require('passport'),
  homeController = require('./controllers/homeController'),
  movieController = require('./controllers/movieController'),
  accountController = require('./controllers/accountController'),
  apiMovieController = require('./controllers/apiMovieControllers'),
  PORT = process.env.PORT || 3000,
  passportConfig = require('./config/auth'),
  config = require('config');
require('dotenv').config();

// Database configuration
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => console.log('connected to DB;'))
  .catch((error) => console.log(error));

// Config
router.use(express.json());
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
router.use(layouts);
router.use(express.static('public'));
router.use(
  express.urlencoded({
    extended: false,
  })
);
router.use(cookieParser('blockbuster_secret_code'));
router.use(connectFlash());
router.use(
  expressSession({
    secret: 'blockbuster_secret_code',
    cookie: {
      maxAge: 300000,
    },
    resave: false,
    saveUninitialized: false,
  })
);
//passport Middleware
router.use(passport.initialize());
router.use(passport.session());
//config passport
passportConfig(passport);
//Global vars
router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.currentUser = req.user;
  console.log(req.user);
  next();
});

// NEW ROUTES
router.get('/', homeController.index);
router.get('/login', accountController.login);
router.get('/genres', movieController.genres);
router.get('/rentals', movieController.rentals);

// MOVIES
router.get('/movies', movieController.movies);
router.get('/movies/new', movieController.new);
router.post(
  '/movies/create',
  movieController.createNew,
  movieController.redirect
);
router.get('/movies/:id', movieController.getMovie);
router.get('/movies/:id/edit', movieController.edit);
router.post(
  '/movies/:id/update',
  movieController.updateMovie,
  movieController.redirect
);
router.post(
  '/movies/:id/delete',
  movieController.deleteMovie,
  movieController.redirect
);
router.post('/movies/search', movieController.searchMovies);

//API MOVIES
router.get(
  '/api/showmovie',
  apiMovieController.getApiMovie,
  apiMovieController.getMovie
);

// USERS
router.get('/users', accountController.getAllUsers);
router.get('/users/create', accountController.create);
router.get('/users/logout', accountController.userLogout);
router.post('/users/create', accountController.createNew);
router.post('/users/login', accountController.userLogin);
// router.get('/users/all', accountController.getAllUsers);
// router.get('/users/:id', accountController.getUser);
// router.get('/users/:id/edit', accountController.editUser);
// router.post(
//   '/users/update',
//   accountController.updateUser,
//   accountController.redirect
// );
// router.post(
//   '/users/:id/delete',
//   accountController.deleteUser,
//   accountController.redirect
// );

// CHECKOUT ROUTING
router.get('/movies/:id/checkout', movieController.getCheckout);

app.use('/', router);

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
