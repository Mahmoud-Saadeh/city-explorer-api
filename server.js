'use strict';

const express = require('express');
require('dotenv').config();

const weatherHandler = require('./modals/weather');
const movieHandler = require('./modals/movie');

const cors = require('cors');

// const weatherData = require('./data/weather.json');

const server = express();
server.use(cors());

server.get('/weather', weatherHandler);

server.get('/movies', movieHandler);

server.use('*', (req, res) => {
  res.status(404).send({ error: 'something went wrong' });
});

server.listen(process.env.PORT, () =>
  console.log(`listening to PORT ${process.env.PORT}`)
);
