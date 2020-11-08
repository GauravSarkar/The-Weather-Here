const express = require("express");
const Datastore = require("nedb");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`starting server at ${port}`);
});
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const database1 = new Datastore("database1.db");
database1.loadDatabase();

app.get("/api", (request, response) => {
  database1.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});

app.post("/api", (request, response) => {
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database1.insert(data);

  response.json(data);
});
app.get("/weather/:latlon", async (request, response) => {
  console.log(request.params);
  const latlon = request.params.latlon.split(",");
  console.log(latlon);
  const lat = latlon[0];
  const lon = latlon[1];
  console.log(lat, lon);
  const api_key = process.env.API_KEY;
  const weather_url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;

  const weather_response = await fetch(weather_url);
  const weather_data = await weather_response.json();

  const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://air-quality.p.rapidapi.com/current/airquality?lon=${lon}&lat=${lat}",
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "2421cb154emshe72e71ac6276c45p1c40a1jsn79044b529a56",
		"x-rapidapi-host": "air-quality.p.rapidapi.com"
	}
};

$.ajax(settings).done(function (response) {
	console.log(response);
});
  
});
