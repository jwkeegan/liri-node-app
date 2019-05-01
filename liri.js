require("dotenv").config();
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

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
    var artist = args[3];
    
}

function spotifyThisSong() {
    
}

function movieThis() {

}

function doWhatItSays() {

}