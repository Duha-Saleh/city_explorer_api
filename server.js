//lab06

//1 first 6
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000


// Routs

app.get('/location', handlerOfLocation);
app.get('/weather', handlerOfWeather);


//Helper Functions

// localhost:3000/location/?city=amman
function handlerOfLocation (req,res){
    var city=req.query.city;
    var data =require('./data/location.json');

    var newLocation = new Location(city, data)

    res.status(200).send(newLocation);

};


function Location(city,data){
this.search_query=city;
this.formatted_query=data[0].display_name;
this.latitude=data[0].lat;
this.longitude=data[0].lon;
}

// localhost:3000/weather?lon=333&lat=4343
function handlerOfWeather (req,res){
    let lon=req.query.longitude;
    let lat=req.query.latitude;
    var data2 =require('./data/weather.json');

    let weatherInfo = [];
     data2.data.map(element =>{
            let newWeather= new Weather(element);
            weatherInfo.push(newWeather);
        })
        res.json(weatherInfo);
    };

function Weather(data2){
    this.forcast=data2.weather.description;
    this.time=data2.valid_date;
    }


// main rout

app.get('*', (req, res) => res.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));


