const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Tweet = require('./models/Tweet');
const Hashtag = require('./models/Hashtag');
const https = require('https');
var CronJob = require('cron').CronJob;

const app = express();
var port = process.env.PORT || 3000; 
var mlab_username = process.env.MLAB_USERNAME
var mlab_password = process.env.MLAB_PASSWORD

//mongoose.connect('mongodb://localhost:27017/ng-tweets', { useNewUrlParser: true });
mongoose.connect(`mongodb://${mlab_username}:${mlab_password}@ds111192.mlab.com:11192/ng-tweets`, { useNewUrlParser: true });

app.use(require('cors')());
app.use(require('body-parser').json());

app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
});

app.get('/api/tweets/:page', (req, res) => {
  Tweet.getTweets(req.params.page, 0, function (tweets, pages) {
    res.json({'data': tweets});
  });
});

app.get('/api/stream/hashtag', (req, res) => {
  Hashtag.find({"label":{"$in":["#paris", "#lapaz", "#hongkong", "#sydney", "#carthage", "#bruxelles", "#douala", "#lima", "#istanbul", "#taipei", "#mexico"]}},{},{}).sort({value: 'desc'}).limit(9).exec(function (err, docs) {
    res.json({'data': docs});
  });
});

var job = new CronJob({
  //cronTime: '*/5 * * * * * *',
  cronTime: '*/15 6-23 * * *',
  onTick: function() {
    /*
     * At every 15th minute past every hour from 6 through 23.
     */
    https.get(`https://ng-tweet.herokuapp.com/api/stream/hashtag`, (resp) => {
      resp.on('data', (chunk) => {});
      // The whole response has been received. Print out the result.
      resp.on('end', () => {});
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });

  },
  start: false,
  timeZone: 'Europe/Paris'
});
job.start();

app.listen(port, '0.0.0.0', () => console.log('Server running'));
