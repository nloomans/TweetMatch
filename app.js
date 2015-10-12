/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

var Twitter = require('twitter');

// to suport POST
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var client = new Twitter({
  consumer_key: 'hwXRy9OvWA2bKZGaMk37N7Wip',
  consumer_secret: 'oYAJVnVb4olD5HJ73ECOajXkH6Yl1HSjiIF9vl7SVoktCSzDFH',
  access_token_key: '2821183414-cXYgw2VaARMh5rD16KfJvHc2RyI7mrCCWZTUJ54',
  access_token_secret: 'NeNznI8YARxnJTwXyUbI1HgIig4jBGHytU03VToK2ID88'
});

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.post('/api',function (req, res) {
  var username = req.body.username;
  console.log("username: "+username);

  client.get('statuses/user_timeline', { screen_name: username, count: 200}, function (error, tweets, response) {
    if(error) throw error;
    // console.log(tweets);
    res.json(tweets);
    console.log(response);
  });
})
// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
