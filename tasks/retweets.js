var Twit = require('twit');

var T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Connect to our mongo database
var MongoClient = require('mongodb').MongoClient
var mlab_username = process.env.MLAB_USERNAME
var mlab_password = process.env.MLAB_PASSWORD
var url = `mongodb://${mlab_username}:${mlab_password}@ds111192.mlab.com:11192/ng-tweets`
//var url = 'mongodb://localhost:27017'

MongoClient.connect(url, { useNewUrlParser: true }).then((client) => {
  const db = client.db('ng-tweets')
  var collection = db.collection('tweets')
  collection.find({}).limit(3)
    .on('data', (doc) => { 
      console.log(JSON.stringify( doc.entities )); 
      var reg = /\s([@#][\w_-]+)/g;
      console.log(doc.text);
      console.log(doc.text.match(reg));
    })
    .on('end', () => { 
      console.log('Done');
      client.close()
    })
})

//var Tweet = require('../models/Tweet');

//  tweetEntry.save(function (err) {
//    if (err) console.log('Err', err);
//    console.log(tweet.created_at);
//  });

// Get favorities and retweets
//  client
//    .post(`favorites/${path}`, { id: req.params.id })
//    .then(tweet => res.send(tweet))
//    .catch(error => res.send(error));
//
//T
//  .post(`statuses/retweet/1024641541820874753`)
//  .then(tweet => console.log(tweet))
//  .catch(error => res.send(error));
//
