var express = require('express'),
    cfenv = require('cfenv'),
    watson = require('watson-developer-cloud'),
    Cloudant = require('cloudant'),
    Twitter = require('twitter'),
    bluemix = require('./config/bluemix'),
    extend = require('util')._extend,
    generateJSON = require('./functions/generateJSON.js'),
    findMatch = require('./functions/findMatch.js');

// create a new express server
var app = express();

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

// if bluemix credentials exists, then override local
var credentials = extend({
  version: 'v2',
  username: '<username>',
  password: '<password>'
}, bluemix.getServiceCreds('personality_insights')); // VCAP_SERVICES

// Create the service wrapper
var personalityInsights = watson.personality_insights(credentials);

// set up cloudant database
var cloudant = Cloudant("https://4e400e16-9397-45bc-b726-ef57f65022ca-bluemix:7decaaffac7a65c32b96b126c1633778874b9a72535142596de994b891ef92cd@4e400e16-9397-45bc-b726-ef57f65022ca-bluemix.cloudant.com");







// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.post('/api',function (req, res) {
  var username = req.body.username;
  var addToDatabase = req.body.addToDatabase;
  console.log("addToDatabase:");
  console.log(addToDatabase);
  console.log(typeof addToDatabase);
  if (addToDatabase == 'true') {
    addToDatabase = true;
  }
  else {
    addToDatabase = false;
  }
  var count;
  if (typeof req.body.count !== 'undefined') {
    var count = req.body.count;
  }
  else {
    var count = 500;
  }
  console.log("username: "+username);

  client.get('statuses/user_timeline', { screen_name: username, count: count}, function (error, tweets, response) {
    if(error) throw error;
    // console.log(tweets);
    // res.json(tweets);

    var watsonInput = {
      recaptcha: '',
      text: '',
      language: 'en',
      acceptLanguage: 'en-US'
    }
    // format:
    // {
    //    recaptcha: '',
    //    text: [text],
    //    language: 'en',
    //    acceptLanguage: 'en-US'
    // }
    for (var i = 0; i < tweets.length; i++) {
      watsonInput.text += tweets[i].text + "\n\n";
    }
    // console.log(response);
    // res.json(watsonInput);
    personalityInsights.profile(watsonInput, function(err, profile) {
      if (err) {
        return next(err);
      }
      else {
        var json = {} // generate the json
        json.data = generateJSON(profile);
        json._id = username;
        var tweetmatch_db = cloudant.db.use('tweetmatch');
        if (addToDatabase) {
          cloudant.db.list(function(err, allDbs) {
            console.log('All my databases: %s', allDbs.join(', '))
          });

          tweetmatch_db.insert(json, function (error, result) {
            if (error) {
              res.json({ error: true, message: error });
            }
            else {
              console.log("It worked!");
              res.json({ error: false });
            }
          });
        }
        else {
          tweetmatch_db.find({
            "selector": {
              "_id": {
                "$gt": 0
              }
            }
          }, function (error, result) {
            if (error) {
              throw error;
            }
            return res.json(findMatch(json.data, result));
            // return res.json(result);
          });
        }
        // return res.json(generateJSON(profile));
      }
    });
  });
})
// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
