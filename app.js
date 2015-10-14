/*** ADDING LIBERARY ***/
var express = require('express'),
    cfenv = require('cfenv'),
    watson = require('watson-developer-cloud'),
    Cloudant = require('cloudant'),
    Twitter = require('twitter'),
    bluemix = require('./config/bluemix'),
    extend = require('util')._extend,
    generateJSON = require('./functions/generateJSON.js'),
    findMatch = require('./functions/findMatch.js'),
    fs = require('fs'),
    bodyParser = require('body-parser');

/*** SERVICES SET UP ***/

// get the app credentials
var credentials = JSON.parse(fs.readFileSync('./credentials.json'));

// create a new express server
var app = express();

// add suport to POST
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// set up twitter
var client = new Twitter(credentials.twitter);
// set up cloudant database
var cloudant = Cloudant(credentials.cloudant.url);
// set up bluemix
var credentials = extend(credentials.bluemix, bluemix.getServiceCreds('personality_insights')); // VCAP_SERVICES
// set up personality insights
var personalityInsights = watson.personality_insights(credentials);

/* SERVER SET UP */
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// TODO: make this a sepret file
app.post('/api',function (req, res) {
  // get the POST perameters
  var username = req.body.username;
  var addToDatabase = req.body.addToDatabase;

  if (addToDatabase == 'true')
    addToDatabase = true;
  else
    addToDatabase = false;

  console.log("username: "+username);

  client.get('statuses/user_timeline', { screen_name: username, count: 500}, function (error, tweets, response) {
    // TODO: handle the error
    if(error) throw error;

    var watsonInput = {
      recaptcha: '',
      text: '',
      language: 'en',
      acceptLanguage: 'en-US'
    }
    /* format = {
      recaptcha: '',
      text: [text],
      language: 'en',
      acceptLanguage: 'en-US'
    } */

    // generate a huge string with all the tweets and 2 spaces at the end of
    // eath tweet.
    for (var i = 0; i < tweets.length; i++) {
      watsonInput.text += tweets[i].text + "\n\n";
    }

    // send the data to watson
    // FIXME: doesn't work on @PoseidonProject, I think this is becuse of the
    // low amount of posts
    personalityInsights.profile(watsonInput, function(err, profile) {
      if (err) {
        return next(err);
      }
      else {
        var json = {};
        // generate the json, see: ./functions/generateJSON.js
        json.data = generateJSON(profile);
        json._id = username; // twitter username

        // connect to the db
        var tweetmatch_db = cloudant.db.use('tweetmatch');
        // do we need to add to the database, or find a match?
        if (addToDatabase) {
          // we need to add to the database

          // add json to db.
          tweetmatch_db.insert(json, function (error, result) {
            // TODO: add error page
            if (error) {
              res.json({ error: true, message: error });
            }
            else {
              res.json({ error: false });
            }
          });
        }
        else {
          // we need to find a match

          // run query
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
            // find a match and return it as a json, see ./functions/findMatch.js
            return res.json(findMatch(json.data, result));
          });
        }
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
