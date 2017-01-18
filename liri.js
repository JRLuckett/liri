/*jshint esversion: 6 */
const request = require('request');
const fs = require('fs');
const Twitter = require('twitter');
const spotify = require('spotify');
const keys = require('./keys.js');

var nodeArgs = process.argv;
var command = process.argv[2];
var commandInfo = "";

//loop through node argument starting at position 4
for (var i = 3; i < nodeArgs.length; i++) {
    //add a + between each index position
    if (i > 3 && i < nodeArgs.length) {
        scommandInfo = songName + "+" + nodeArgs[i];
    } else {
        commandInfo += nodeArgs[i];
    }
}
if (command === 'my-tweets') {
    var client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });
    var params = {
        screen_name: 'J_R_Luckett'
    };
    client.get('statuses/user_timeline', params, function(error, tweets, data) {
        if (error) {
            console.log("Error");
        }
        for(i = 0; i < 20; i++){
          console.log('Tweet',[i + 1],': ',tweets[i].text);
          console.log('Time Tweeted: ',tweets[i].created_at);
        }
    });
} else if (command === "spotify-this-song") {
    //song variable
    var songName = commandInfo;

    // spotify search with process.argv index 3 +
    spotify.search({
        type: 'track',
        query: songName,
        limit: 2
    }, function(err, data) {
        //throw error
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        //artist
        console.log('Artist: ', data.tracks.items[0].album.artists[0].name);
        //song
        console.log('Song: ', data.tracks.items[0].name);
        //preview link
        console.log('Preview URL: ', data.tracks.items[0].preview_url);
        //album
        console.log('Album: ', data.tracks.items[0].album.name);
    });
} else if (command === "movie-this") {
    var movieName = commandInfo;
    var omdbQuery = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json&tomatoes=true";
    request(omdbQuery, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMBD Rating: " + JSON.parse(body).imdbRating);
            console.log("Country of Production: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
            console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
        }
    });

} else if (command === "do-what-it-says") {
    //read file
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            console.log('Error occurred');
        }
        //split file with , and save to array
        var array = data.split(",");
        //spotify search with array index 1
        spotify.search({
            type: 'track',
            query: array[1]
        }, function(err, data) {
            //throw error
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            }
            //artist
            console.log('Artist: ', data.tracks.items[0].album.artists[0].name);
            //song
            console.log('Song: ', data.tracks.items[0].name);
            //preview link
            console.log('Preview url: ', data.tracks.items[0].preview_url);
            //album
            console.log('Album: ', data.tracks.items[0].album.name);
        });
    });

} else {
    console.log("not quite sure what you're asking...try my-tweets, spotify-this-song, movie-this, or do-what-it-says as a command before your search");
}
