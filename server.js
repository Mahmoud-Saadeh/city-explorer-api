'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');

const weatherData = require('./data/weather.json');

const server = express();
server.use(cors());

server.get('/weather', (req, res) => {
  const location = req.query;
  let dataArr = [];
  const searchedCity = weatherData.find(
    (item) => item.city_name.toLowerCase() === location.city_name.toLowerCase()
  );
  if (searchedCity) {
    class Forecast {
      constructor(date, description) {
        this.date = date;
        this.description = description;
      }
    }
    searchedCity.data.forEach((item) => {
      dataArr.push(new Forecast(item.valid_date, item.weather.description));
    });
    res.status(200).send(dataArr);
  } else {
    res
      .status(500)
      .send(
        `Couldn't find this location, Choose between Amman, Paris & Seattle`
      );
  }
});

server.use('*', (req, res) => {
  res.status(404).send({ error: 'something went wrong' });
});

server.listen(process.env.PORT, () =>
  console.log(`listening to PORT ${process.env.PORT}`)
);
