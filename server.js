'use strict';


///lab7

//1 first 6
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000

//(added )1API and 4D.B
const superagent= require('superagent');

// Routs
app.get('/location', handlerOfLocation);
app.get('/weather', handlerOfWeather);
app.get('/trails', handlerOfTrails);


function handlerOfLocation(req,res){
        const city = req.query.city;
    let key = process.env.LOCATIONIQ_KEY;
    let url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
    
     superagent.get(url).then(location =>{
     let newLocation= new Location (city, location.body);
             res.status(200).json(newLocation);

    });   
}
function Location(city, location){
    this.search_query = city;
    this.formatted_query = location[0].display_name;
    this.latitude = location[0].lat;
    this.longitude = location[0].lon;
};


function handlerOfWeather(request, response){
    const lat = request.query.lat;
    const lon = request.query.lon;
    let key = process.env.WEATHERBIT_KEY;
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;

     superagent.get(url).then(weather =>{
        let weatherInfo = [];
         weather.body.data.map(element =>{
            let newWeather= new Weather(element);
            weatherInfo.push(newWeather);
        })
        response.json(weatherInfo);

    })

}
function Weather(day){
    this.description = day.weather.description;
    this.time = day.valid_date
};

// localhost:3000/trails?lat=333&lon=4343

function handlerOfTrails(request, response){
    let lat = request.query.lat;
    let lon = request.query.lon;
    let key2 = process.env.TRIAL_API_KEY;
    let url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&key=${key2}`;
    
    superagent.get(url).then(trails =>{
    let trialsInfo = [];
     trails.body.trails.map(element =>{
        let newTrial= new Trails(element);
        trialsInfo.push(newTrial);
    });

        response.status(200).json(trialsInfo);
    });
}
function Trails(trails){
    this.name = trails.name;
    this.location = trails.location;
    this.length = trails.length;
    this.stars = trails.stars;
    this.star_votes = trails.starVotes;
    this.summary = trails.summary;
    this.trail_url = trails.url;
    this.conditions = trails.conditionStatus;
    this.condition_time = trails.conditionDate;

}

///main rout

app.get('*', (req, res) => res.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));



