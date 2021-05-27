const axios = require('axios');

class Forecast {
  constructor(date, description, low_temp, max_temp, icon) {
    this.date = date;
    this.description = description;
    this.low_temp = low_temp;
    this.max_temp = max_temp;
    this.icon = `https://www.weatherbit.io/static/img/icons/${icon}.png`;
  }
}
const weatherHandler = (req, res) => {
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
};

module.exports = weatherHandler;
