const axios = require('axios');

class Movie {
  constructor(movie) {
    this.title = movie.title;
    this.overview = movie.overview;
    this.average_votes = movie.vote_average;
    this.total_votes = movie.vote_count;
    this.image_url = movie.backdrop_path;
    this.popularity = movie.popularity;
    this.released_on = movie.release_date;
  }
}
const cachedData = {};
const movieHandler = (req, res) => {
  const location = req.query;
  if (!location.city_name) {
    res.status(400).send(`Somthing went wrong.`);
    return;
  }
  if (cachedData[location.city_name]) {
    res.status(200).send(cachedData[location.city_name]);
    return;
  }
  let movies = [];
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${location.city_name}`;
  axios
    .get(url)
    .then((response) => {
      let reqMovies;
      if (response.data.results.length > 20) {
        reqMovies = 20;
      } else if (response.data.results.length > 0) {
        reqMovies = response.data.results.length;
      } else if (response.data.results.length === 0) {
        res.status(400).send(`Couldn't find this location.`);
        return;
      }

      for (let i = 0; i < reqMovies; i++) {
        movies.push(new Movie(response.data.results[i]));
      }
      cachedData[location.city_name] = { movies, date: new Date() };
      res.status(200).send(cachedData[location.city_name]);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send(`Somthing went wrong.`);
    });
};

module.exports = movieHandler;
