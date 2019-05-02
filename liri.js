require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var fs = require("fs");
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

    if (args.length < 4) {
        console.log("Please enter artist or band name");
        return;
    }

    var artist = args[3];
    if (args.length > 4) {
        for (i = 4; i < args.length; i++) {
            artist += "+" + args[i];
        }
    }

    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(
        function (response) {

            if (response.status !== 200) {
                return console.log("Request error: " + response.status + ": " + response.statusText);
            } else if (response.data.length == 0) {
                return console.log("No concerts found!");
            }

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
        }
    ).catch(function(error) {
        console.log(error.response.status + ": " + error.response.statusText);
    });
}

function spotifyThisSong() {

    var song;
    if (args.length < 4) song = "The Sign";
    else {
        song = args[3];
        for (i = 4; i < args.length; i++) {
            song += " " + args[i];
        }
    }

    spotify.search({ type: "track", query: song, limit: 1 }, function (err, response) {

        if (err) return console.log(err);

        res = response.tracks.items;
        var artists = res[0].artists[0].name;
        for (i = 1; i < res[0].artists.length; i++) {
            artists += ", " + res[0].artists[i].name;
        }
        var name = res[0].name;
        var link = res[0].preview_url;
        var album = res[0].album.name;

        console.log("-------------------------");
        console.log("Song: " + name);
        console.log("Artist(s): " + artists);
        console.log("Link: " + link);
        console.log("Album: " + album);
        console.log("-------------------------");

    });
}

function movieThis() {

    var movie;
    if (args.length < 4) movie = "Mr. Nobody";
    else {
        movie = args[3];
        for (i = 4; i < args.length; i++) {
            movie += "+" + args[i];
        }
    }

    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            console.log("-------------------------");
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            for (i = 0; i < response.data.Ratings.length; i++) {
                if (response.data.Ratings[i].Source == "Internet Movie Database" ||
                    response.data.Ratings[i].Source == "Rotten Tomatoes") {
                    console.log(response.data.Ratings[i].Source + " Rating: " + response.data.Ratings[i].Value);
                }
            }
            console.log("Country of Production: " + response.data.Country);
            console.log("Language(s): " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Major Actors: " + response.data.Actors);
            console.log("-------------------------");
        }
    );

}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) return console.log(err);

        var command = data.split(",")[0];
        args[3] = data.split(",")[1];
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
        }

    })
}