//lab 9

// //1 first 6
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000

// //(added )1API and 4D.B
const superagent= require('superagent');
// const pg =require('pg');
// const client = new pg.Client(process.env.DATABASE_URL);
// client.connect();
// client.on('error', err => console.error(err));


// // Routs
app.get('/movies', handlerOfMovies);
app.get('/yelp', handlerOfYelp);

//helper Functions

// http://localhost:3000/movies?region_code=JO
function handlerOfMovies(req, res){
let region_code='JO';
    let movie_key = process.env.MOVIE_API_KEY;
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${movie_key}&language=en-US&region=${region_code}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`;

    let movieInfo = [];

    superagent.get(url).then(movie =>{
        movie.body.results.map(element =>{
            let newMovie = new Movies(element);
            movieInfo.push(newMovie);
        })
        res.send(movieInfo);
    })
}
function Movies(movies){
    this.title = movies.title;
    this.overview = movies.overview;
    this.average_votes = movies.average_votes;
    this.total_votes = movies.total_votes;
    this.image_url = `https://image.tmdb.org/t/p/w500/${movies.poster_path}`;
    this.popularity = movies.popularity;
    this.released_on = movies.released_on;
}

// http://localhost:3000/yelp?location=amman
function handlerOfYelp(request, response) {
    let city = request.query.search_query;
    getYelpData(city)
      .then(data => {
        response.status(200).send(data);
    });
}
function getYelpData(city) {
    const url = `https://api.yelp.com/v3/businesses/search?location=${city}`;
    return superagent.get(url)
        .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
        .then(data => {
            const yelp = data.body.businesses.map(element => {
                return new Yelp(element)
            });
            return yelp;
        });
}
function Yelp(details) {
    this.url = details.url;
    this.name = details.name;
    this.price = details.price;
    this.rating = details.rating;
    this.image_url = details.image_url;
};

// ///main rout

app.get('*', (req, res) => res.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));


