# TweetMatch

## install
1. create a [bluemix](http://console.eu-gb.bluemix.net) account
2. create a note.js web app.
3. clone this repo `git clone https://github.com/nloomans/TweetMatch.git`
4. follow there instructions form stap 3 to 5.
5. go to overview > add a service or API
6. add persenelety insights and Personality Insights and Cloudant NoSQL DB
7. launch Cloudant and create the `tweetmatch` database
7. go to [twitter apps](https://apps.twitter.com/) and create an app
8. open the app and click on *Keys and Access Tokens* then click on Generate *Consumer Key and Secret*
9. create a credentials.json, it will look like this:
	```
	{
		"twitter": {
			"consumer_key": "<your twitter consumer_key>",
			"consumer_secret": "<your twitter consumer_secret>",
			"access_token_key": "<your twitter access_token_key>",
			"access_token_secret": "<your twitter access_token_secret>"
		},
		"bluemix": {
			"version": "v2",
			"username": "<your bluemix username> (NOT the same as your login username!)",
			"password": "<your bluemix password> (NOT the same as your login password!)"
		},
		"cloudant": {
			"url": "<cloadant url>"
		}
	}
	```
	you can get the bluemix and cloudant credentials by going to "Environment Variables" in bluemix.

10. edit the `manifest.yml` to fit your app
11. type `cf push [app name]`
