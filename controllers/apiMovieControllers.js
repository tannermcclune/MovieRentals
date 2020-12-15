const APIKEY = '2292c0a68349f95400f7059f9a33b936';
const axios = require('axios');
const instance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});
const baseUrl = 'https://image.tmdb.org/t/p/original/';

const requests = {
  fetchTrending: `/trending/all/week?api_key=${APIKEY}&language=en-US`,
  fetchOriginals: `/discover/tv?api_key=${APIKEY}&with_networks=213`,
  fetchTopRated: `/movie/top_rated?api_key=${APIKEY}&language=en-US`,
  fetchActionMovies: `/discover/movie?api_key=${APIKEY}&with_genres=28`,
  fetchComedyMovies: `/discover/movie?api_key=${APIKEY}&with_genres=35`,
  fetchHorrorMovies: `/discover/movie?api_key=${APIKEY}&with_genres=27`,
  fetchRomanceMovies: `/discover/movie?api_key=${APIKEY}&with_genres=10749`,
  fetchDocumentaries: `/discover/movie?api_key=${APIKEY}&with_genres=99`,
};

module.exports = {
  getApiMovie: async (req, res, next) => {
    const trendingRequest = await instance.get(requests.fetchTrending);
    const topRatedRequest = await instance.get(requests.fetchTopRated);
    const actionRequest = await instance.get(requests.fetchActionMovies);
    const comedyRequest = await instance.get(requests.fetchComedyMovies);
    const horrorRequest = await instance.get(requests.fetchHorrorMovies);
    const romanceRequest = await instance.get(requests.fetchRomanceMovies);
    const trendingMovies = trendingRequest.data.results;
    const topRatedMovies = topRatedRequest.data.results;
    const actionMovies = actionRequest.data.results;
    const comedyMovies = comedyRequest.data.results;
    const horrorMovies = horrorRequest.data.results;
    const romanceMovies = romanceRequest.data.results;
    res.locals.trendingMovies = trendingMovies;
    res.locals.topRatedMovies = topRatedMovies;
    res.locals.actionMovies = actionMovies;
    res.locals.comedyMovies = comedyMovies;
    res.locals.horrorMovies = horrorMovies;
    res.locals.romanceMovies = romanceMovies;
    // console.log(res.locals.movies);
    next();
  },
  getMovie: (req, res, next) => {
    const {
      trendingMovies,
      topRatedMovies,
      actionMovies,
      comedyMovies,
      horrorMovies,
      romanceMovies,
    } = res.locals;
    // console.log(trendingMovies[0]);
    res.render('apiMovies/allMovies.ejs', {
      trendingMovies: trendingMovies,
      topRatedMovies: topRatedMovies,
      actionMovies: actionMovies,
      comedyMovies: comedyMovies,
      baseUrl: baseUrl,
    });
  },
  getSingleTrending: (req, res, next) => {
    const movies = res.locals.trendingMovies;
    const id = req.params.id;
    const movie = movies.filter((m) => m.id == id);
    res.render('apiMovies/singleMovie.ejs', {
      baseUrl: baseUrl,
      movie: movie[0],
    });
  },

  getSingleTopRated: (req, res, next) => {
    const movies = res.locals.topRatedMovies;
    const id = req.params.id;
    const movie = movies.filter((m) => m.id == id);
    res.render('apiMovies/singleMovie.ejs', {
      baseUrl: baseUrl,
      movie: movie[0],
    });
  },

  getSingleAction: (req, res, next) => {
    const movies = res.locals.actionMovies;
    const id = req.params.id;
    const movie = movies.filter((m) => m.id == id);
    res.render('apiMovies/singleMovie', {
      baseUrl: baseUrl,
      movie: movie[0],
    });
  },

  getSingleComedy: (req, res, next) => {
    const movies = res.locals.comedyMovies;
    const id = req.params.id;
    const movie = movies.filter((m) => m.id == id);
    res.render('apiMovies/singleMovie', {
      baseUrl: baseUrl,
      movie: movie[0],
    });
  },
};
