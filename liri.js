var fs = require('fs');
var spotify = require('spotify');
var Twitter = require('twitter');
var request = require('request');
var colors = require('colors');

var twitKeys = require('./keys.js');

var cmd = process.argv[2];
var srchTerm = process.argv[3];

// console.log('Command: ' + cmd + '\nTerm: ' + srchTerm);
function flowControl(cmd, srchTerm) {
	switch (cmd) {

		case "my-tweets":						 
			var client = new Twitter({
				consumer_key: twitKeys.twitterKeys.consumer_key,
				consumer_secret: twitKeys.twitterKeys.consumer_secret,
				access_token_key: twitKeys.twitterKeys.access_token_key,
				access_token_secret: twitKeys.twitterKeys.access_token_secret
			});		 
			var params = {screen_name: 'ken_wheeler'};
			client.get('statuses/user_timeline', params, function(error, tweets, response) {
				if (error) {
					console.log(error);
				} else {
					for (i = 0; i < tweets.length; i++) {
						console.log("Tweeted: ".cyan.bgBlack.bold + tweets[i].created_at.yellow.bgBlack);
						console.log("Tweet: ".cyan.bgBlack.bold + tweets[i].text.yellow.bgBlack + "\n\n".yellow.bgBlack);
					}
				}
			});
			break;

		case "spotify-this-song":
			// console.log("Term: " + srchTerm);
			if (srchTerm == undefined) srchTerm = "the sign ace of base";
			spotify.search({ type: 'track', query: srchTerm }, function(err, data) {
				if ( err ) {
				  console.log('Error occurred: ' + err);
				  return;
				}
				// console.log(data.tracks.items[0]);
				console.log("Artist(s): ".cyan.bgBlack.bold + data.tracks.items[0].artists[0].name.yellow.bgBlack); 
				console.log("Song Name: ".cyan.bgBlack.bold + data.tracks.items[0].name.yellow.bgBlack);
				console.log("Preview Link: ".cyan.bgBlack.bold + data.tracks.items[0].preview_url.yellow.bgBlack);
				console.log("Album: ".cyan.bgBlack.bold + data.tracks.items[0].album.name.yellow.bgBlack);
			});
			break;

		case "movie-this":
			// console.log("Term: " + srchTerm);
			if (srchTerm == undefined) srchTerm = "Mr.+Nobody";
			request('http://www.omdbapi.com/?t=' + srchTerm + '&tomatoes=true&r=json', function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			    var movie = JSON.parse(body);
			    // console.log(JSON.stringify(movie, null, 2));
			    console.log(
			    	'Movie Title: '.cyan.bgBlack.bold + movie.Title.yellow.bgBlack + '\n'.yellow.bgBlack +
			    	'Year Released: '.cyan.bgBlack.bold + movie.Year.yellow.bgBlack + '\n'.yellow.bgBlack +
			    	'IMDB Rating: '.cyan.bgBlack.bold + movie.imdbRating.yellow.bgBlack + '\n'.yellow.bgBlack +
			    	'Country: '.cyan.bgBlack.bold + movie.Country.yellow.bgBlack + '\n'.yellow.bgBlack +
			    	'Language: '.cyan.bgBlack.bold + movie.Language.yellow.bgBlack + '\n'.yellow.bgBlack +
			    	'Plot Synopsis: '.cyan.bgBlack.bold + movie.Plot.yellow.bgBlack + '\n'.yellow.bgBlack +
			    	'Actors: '.cyan.bgBlack.bold + movie.Actors.yellow.bgBlack + '\n'.yellow.bgBlack +
			    	'Rotten Tomatoes Rating: '.cyan.bgBlack.bold + movie.tomatoRating.yellow.bgBlack + '\n'.yellow.bgBlack +
			    	'Rotten Tomatoes URL: '.cyan.bgBlack.bold + movie.tomatoURL.yellow.bgBlack
			    );
			  }
			});
			break;

		case "do-what-it-says":
			fs.readFile("random.txt", "utf8", function(err, text) {
				var argsArray = text.split(",");
				// console.log(argsArray);
				flowControl(argsArray[0], argsArray[1]);
			});
			break;

		default:
			console.log('LIRI did not recognize command. Please try again.'.cyan.bgBlack.bold);
	}
}; // close switch

flowControl(cmd, srchTerm);