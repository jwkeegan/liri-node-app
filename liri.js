// Require packages & setup spotify keys

require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

// Take in command line args
var args = process.argv;
var command = args[2];

// Switch for Command: each of four commands calls respective command,
// If no valid command was found, show user valid commands
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

// Function for command concert-this
// Take in artist and find upcoming concerts
function concertThis() {

    // if there isn't an arg after concert-this, ask for artist and end
    if (args.length < 4) {
        console.log("Please enter artist or band name");
        return;
    }

    // store artist (including spaces)
    var artist = args[3];
    if (args.length > 4) {
        for (i = 4; i < args.length; i++) {
            artist += "+" + args[i];
        }
    }

    // axios call to bands in town to get concert info
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(
        function (response) {

            // if there is an issue or there is no info, handle error here
            if (response.status !== 200) {
                return console.log("Request error: " + response.status + ": " + response.statusText);
            } else if (response.data.length == 0) {
                return console.log("No concerts found!");
            }

            // store response data and initialize variables
            var res = response.data;
            var name;
            var location;
            var date;

            var fullInfo;

            for (i = 0; i < res.length; i++) {

                // grab info from response and format date into MM/DD/YYYY
                name = res[i].venue.name;
                location = res[i].venue.city;
                if (res[i].venue.region) location += ", " + res[i].venue.region;
                location += ", " + res[i].venue.country;
                date = moment(res[i].datetime).format("MM/DD/YYYY");

                var info = [
                    "Venue: " + name,
                    "Location: " + location,
                    "Date of Event: " + date,
                    "-------------------------\n"
                ].join("\n");

                fullInfo += info;

                // console.log("Venue: " + name);
                // console.log("Location: " + location);
                // console.log("Date of Event: " + date);
                // console.log("-------------------------");

            }

            // log and display info
            fs.appendFile("log.txt", fullInfo, function (err) {
                if (err) throw err;
                console.log(fullInfo);
            });
        }
    )
        // catch errors and display error code and text
        .catch(function (error) {
            console.log(error.response.status + ": " + error.response.statusText);
        });
}

// Function spotify-this-song
// take in song and display artist, album, song name, and spotify link
function spotifyThisSong() {

    // store song (including spaces)
    // if there is no song in command line, default to "The Sign"
    var song;
    if (args.length < 4) song = "The Sign";
    else {
        song = args[3];
        for (i = 4; i < args.length; i++) {
            song += " " + args[i];
        }
    }

    // use spotify search function setup with developer keys
    spotify.search({ type: "track", query: song, limit: 1 }, function (err, response) {

        // if there is an error, display it
        if (err) {
            return console.log(err);
        }

        // store response and collect relevant info
        res = response.tracks.items;
        var artists = res[0].artists[0].name;
        for (i = 1; i < res[0].artists.length; i++) {
            artists += ", " + res[0].artists[i].name;
        }
        var name = res[0].name;
        var link = res[0].preview_url;
        var album = res[0].album.name;

        var info = [
            "Song: " + name,
            "Artist(s): " + artists,
            "Link: " + link,
            "Album: " + album,
            "-------------------------\n"
        ].join("\n");

        // log and display info
        fs.appendFile("log.txt", info, function (err) {
            if (err) throw err;
            console.log(info);
        });

        // // display info
        // console.log("Song: " + name);
        // console.log("Artist(s): " + artists);
        // console.log("Link: " + link);
        // console.log("Album: " + album);
        // console.log("-------------------------");

    });
}

// Function movie-this
// User inputs movie and liri displays Title, Release Year, IMDB & Rotten Tomatoes ratings,
// Country (production), Language, Plot, and Actors
function movieThis() {

    // Store user requested movie (including spaces)
    // if no input, default to "Mr. Nobody"
    var movie;
    if (args.length < 4) movie = "Mr. Nobody";
    else {
        movie = args[3];
        for (i = 4; i < args.length; i++) {
            movie += "+" + args[i];
        }
    }

    // use axios to access omdbapi to get data
    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
        function (response) {

            var ratingsArray = [];
            for (i = 0; i < response.data.Ratings.length; i++) {
                if (response.data.Ratings[i].Source == "Internet Movie Database" ||
                    response.data.Ratings[i].Source == "Rotten Tomatoes") {
                    ratingsArray.push(response.data.Ratings[i].Source + " Rating: " + response.data.Ratings[i].Value);
                }
            }

            var info = [
                "Title: " + response.data.Title,
                "Release Year: " + response.data.Year
            ];

            for (var key in ratingsArray) {
                info.push(ratingsArray[key]);
            }

            info.push(
                "Country of Production: " + response.data.Country,
                "Language(s): " + response.data.Language,
                "Plot: " + response.data.Plot,
                "Major Actors: " + response.data.Actors,
                "-------------------------\n"
            );

            info = info.join("\n");

            // log and display info
            fs.appendFile("log.txt", info, function (err) {
                if (err) throw err;
                console.log(info);
            });

            // // display relevant info
            // console.log("-------------------------");
            // console.log("Title: " + response.data.Title);
            // console.log("Release Year: " + response.data.Year);
            // // for loop to loop through ratings and look for IMDB and Rotten Tomatoes ratings
            // for (i = 0; i < response.data.Ratings.length; i++) {
            //     if (response.data.Ratings[i].Source == "Internet Movie Database" ||
            //         response.data.Ratings[i].Source == "Rotten Tomatoes") {
            //         console.log(response.data.Ratings[i].Source + " Rating: " + response.data.Ratings[i].Value);
            //     }
            // }
            // console.log("Country of Production: " + response.data.Country);
            // console.log("Language(s): " + response.data.Language);
            // console.log("Plot: " + response.data.Plot);
            // console.log("Major Actors: " + response.data.Actors);
            // console.log("-------------------------");
        }
    );

}

// Function do-what-is-says
// If user doesn't know what they want to do, take text from random.txt
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {

        // log error and return if applicable
        if (err) {
            return console.log(err);
        }

        // first half of random.txt is command,
        // second half is search term
        var command = data.split(",")[0];

        // replace args[3] with search term, and call the function in random.txt
        args[3] = data.split(",")[1].trim();
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