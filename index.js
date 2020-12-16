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
  adminController = require('./controllers/adminController'),
  apiMovieController = require('./controllers/apiMovieControllers'),
  rentalsController = require('./controllers/rentalsController'),
  transactionController = require('./controllers/transactionController'),
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
    extended: true,
  })
);
router.use(cookieParser('blockbuster_secret_code'));
router.use(connectFlash());
router.use(
  expressSession({
    secret: 'blockbuster_secret_code',
    cookie: {
      maxAge: 3000000,
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
  next();
});

// NEW ROUTES
router.get('/', homeController.index);
router.get('/login', accountController.login);
router.get('/genres', movieController.genres);

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
router.get(
  '/api/movies/singleTrendingNow/:id',
  apiMovieController.getApiMovie,
  apiMovieController.getSingleTrending
);
router.get(
  '/api/movies/singleTopRated/:id',
  apiMovieController.getApiMovie,
  apiMovieController.getSingleTopRated
);
router.get(
  '/api/movies/singleAction/:id',
  apiMovieController.getApiMovie,
  apiMovieController.getSingleAction
);
router.get(
  '/api/movies/singleComedy/:id',
  apiMovieController.getApiMovie,
  apiMovieController.getSingleComedy
);
router.get(
  '/api/newStockForm/:id',
  apiMovieController.getApiMovie,
  apiMovieController.getAddForm
);

// Link for REST API for movies that are in stock at Blockbuster 2.0
router.get("/api/export/movies", apiMovieController.getMovieRestAPI);


// USERS
router.get('/users/create', accountController.create);
router.get('/users/logout', accountController.userLogout);
router.post('/users/create', accountController.createNew);
router.post('/users/login', accountController.userLogin);
// router.get('/users/all', accountController.getAllUsers);
router.get('/users/:id', accountController.getUser);

// ADMIN
router.get(
  '/admin/users',
  adminController.isAdmin,
  adminController.getAllUsers
);
router.get(
  '/admin/users/:id',
  adminController.isAdmin,
  adminController.getUser
);
router.post("/admin/saveAdmin", adminController.isAdmin, adminController.updateUsers);

// CHECKOUT ROUTING
router.get('/movies/:id/checkout', movieController.getCheckout);
router.post('/checkout', transactionController.addTransaction);
router.get('/admin/transactions', transactionController.getAdminTransactions);
router.get('/transactions', transactionController.getUserTransactions);
router.get('/rentals', transactionController.getRentals);
router.get('/rentals/:id/view', rentalsController.getRentalPage);
router.get('/rentals/:id/watch', rentalsController.getRentalWatchPage);

app.use('/', router);

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
