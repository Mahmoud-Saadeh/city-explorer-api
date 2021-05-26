'use strict';

const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');

// const weatherData = require('./data/weather.json');

const server = express();
server.use(cors());

// const weatherApiDataHandler = (lat, lon) => {
//   const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
//   console.log(url);
//   return axios
//     .get(url)
//     .then((response) => {
//       return response.data;
//     })
//     .catch((error) => {
//       console.log(error);
//       return error;
//     });
// };
class Forecast {
  constructor(date, description, low_temp, max_temp, icon) {
    this.date = date;
    this.description = description;
    this.low_temp = low_temp;
    this.max_temp = max_temp;
    this.icon = `https://www.weatherbit.io/static/img/icons/${icon}.png`;
  }
}
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
server.get('/weather', (req, res) => {
  const location = req.query;
  let dataArr = [];
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${location.lat}&lon=${location.lon}&key=${process.env.WEATHER_API_KEY}`;
  axios
    .get(url)
    .then((response) => {
      let searchedCity = response.data;

      if (searchedCity) {
        searchedCity.data.forEach((item) => {
          dataArr.push(
            new Forecast(
              item.valid_date,
              item.weather.description,
              item.low_temp,
              item.max_temp,
              item.weather.icon
            )
          );
        });
        res.status(200).send(dataArr);
      } else {
        res.status(500).send(`Couldn't find this location.`);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send(`Couldn't find this location.`);
    });
});

server.get('/movies', (req, res) => {
  const location = req.query;
  if (!location.city_name) {
    res.status(400).send(`Somthing went wrong.`);
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
      res.status(200).send(movies);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send(`Somthing went wrong.`);
    });
});

server.use('*', (req, res) => {
  res.status(404).send({ error: 'something went wrong' });
});

server.listen(process.env.PORT, () =>
  console.log(`listening to PORT ${process.env.PORT}`)
);
