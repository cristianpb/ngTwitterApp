const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Tweet = require('./models/Tweet');
const Hashtag = require('./models/Hashtag');

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
  Hashtag.find({"label":{"$in":["#Paris","#France","#sports"]}},{},{}).sort({value: 'desc'}).limit(9).exec(function (err, docs) {
    res.json({'data': docs});
  });
});

app.listen(port, '0.0.0.0', () => console.log('Server running'));
