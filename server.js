'use strict';
//lab8

// //1 first 6
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000

// //(added )1API and 4D.B
const superagent= require('superagent');
const pg =require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));


// // Routs

app.get('/location', handlerOfLocation);
app.get('/weather', handlerOfWeather);
app.get('/trails', handlerOfTrails);


//helper Functions
function  handlerOfLocation (req, res) {
    let city = req.query.city;
    let locationKey = process.env.LOCATIONIQ_KEY;
    let url = `https://eu1.locationiq.com/v1/search.php?key=${locationKey}&q=${city}&format=json`;
    let selectSQL =`SELECT * FROM locations WHERE search_query='${city}'`

    client.query(selectSQL).then(result=>{
if(result.rowCount){
    res.send(result);
}
else{
    superagent.get(url)
    .then(data => {
        let newLocation = new Location(city, data.body);
        let queryValues=[newLocation.search_query,newLocation.formatted_query,newLocation.latitude,newLocation.longitude];
let SQL=`INSERT INTO locations (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4)`;
client.query(SQL,queryValues).then(result => { 
    res.send(newLocation);

});

    });

};

});

};

function Location(city,data){
this.search_query=city;
this.formatted_query=data[0].display_name;
this.latitude=data[0].lat;
this.longitude=data[0].lon;
}

function handlerOfWeather(req, res){
    const lat = req.query.lat;
    const lon = req.query.lon;
    let key = process.env.WEATHERBIT_KEY;
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;

     superagent.get(url).then(weather =>{
        let weatherInfo = [];
         weather.body.data.map(element =>{
            let newWeather= new Weather(element);
            weatherInfo.push(newWeather);
        })
        res.json(weatherInfo);

    })

}
function Weather(day){
    this.description = day.weather.description;
    this.time = day.valid_date
};

// localhost:3000/trails?lat=333&lon=4343

function handlerOfTrails(req, res){
    let lat = req.query.lat;
    let lon = req.query.lon;
    let key2 = process.env.TRIAL_API_KEY;
    let url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&key=${key2}`;
    
    superagent.get(url).then(trails =>{
    let trialsInfo = [];
     trails.body.trails.map(element =>{
        let newTrial= new Trails(element);
        trialsInfo.push(newTrial);
    });

        res.status(200).json(trialsInfo);
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




