require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
require("node-spotify-api");
var keys = require("./keys.js");

// var spotify = new Spotify(keys.spotify);

var args = process.argv;
var command = args[2];

switch (command) {
    case "concert-this":
        concertThis();
        break;
    case "spotify-this-song":
        spotifyThisSong();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("Please enter valid command:");
        console.log("concert-this");
        console.log("spotify-this-song");
        console.log("movie-this");
        console.log("do-what-it-says");
}

function concertThis() {

    if (args.length < 4) {
        console.log("Please enter artist or band name");
        return;
    }

    var artist = args[3];

    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(
        function(response) {

            var res = response.data;
            console.log("-------------------------");
            var name;
            var location;
            var date;

            for (i = 0; i < res.length; i++) {
                
                name = res[i].venue.name;
                location = res[i].venue.city;
                if (res[i].venue.region) location += ", " + res[i].venue.region;
                location += ", " + res[i].venue.country;
                date = moment(res[i].datetime).format("MM/DD/YYYY");

                console.log("Venue: " + name);
                console.log("Location: " + location);
                console.log("Date of Event: " + date);
                console.log("-------------------------");

            }
            // console.log(response.data.length);
            // console.log(response.data[0]);
            // console.log(response.data[1]);
            // console.log(response.data[2]);
        }
    );
}

function spotifyThisSong() {
    
}

function movieThis() {

}

function doWhatItSays() {

}