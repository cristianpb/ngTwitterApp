var Twit = require('twit');

var T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var MongoClient = require('mongodb').MongoClient
var mlab_username = process.env.MLAB_USERNAME
var mlab_password = process.env.MLAB_PASSWORD
var url = `mongodb://${mlab_username}:${mlab_password}@ds111192.mlab.com:11192/ng-tweets`
//var url = 'mongodb://localhost:27017'

var Tweet = require('../models/Tweet');

var stream = T.stream('statuses/filter', {
  track: 'paris'
});

stream.on('tweet', function (tweet) {
  // Construct a new tweet object

  // Create a new model instance with our object
  var tweetEntry = new Tweet(tweet);

  MongoClient.connect(url, { useNewUrlParser: true }).then((client) => {
    const db = client.db('ng-tweets')
    var collection = db.collection('tweets')
    collection.insertOne(tweet)
      .then(() => {
        let reg = /\s([@#][\w_-]+)/g;
        console.log(tweet.text);
        console.log(tweet.text.match(reg));
        var hashtags = tweet.text.match(reg);
        if (hashtags.length) {
          if (hashtags.length > 0) {
            hashtags.forEach(tag => {
              db.collection('hashtags')
                .find({ 'hashtag' : tag }).toArray()
                .then(docs => {
                  if ( docs.length === 0 ) {
                    console.log('Zero');
                    db.collection('hashtags').insert({'hashtag': tag, "value": 1})
                  } else {
                    console.log('Updating');
                    db.collection('hashtags').findOneAndUpdate(
                      { 'hashtag' : tag },
                      { $inc: { "value" : 1 }}
                    ).then( (res) => console.log('updated', res))
                     .catch((err) => console.log(err))
                    db.collection('tweets').findOneAndUpdate(
                      {"id_str": tweet.id_str} ,
                      { $set: { "hashtags": hashtags }}
                    )
                      .then( res => console.log('Updated', res))
                      .catch( err => console.log(err))
                  }
                })
            })
          }
        }
      })
    .catch(err => console.log(err))
  // Save 'er to the database
  //tweetEntry.save(function (err) {
  //  if (err) console.log('Err', err);
  //  console.log(tweet.created_at);
  });
})

stream.on('limit', function (limitMessage) {
  console.log('Limit for User : on query has rechead!');
});

stream.on('warning', function (warning) {
  console.log('warning', warning);
});

// https://dev.twitter.com/streaming/overview/connecting
stream.on('reconnect', function (request, response, connectInterval) {
  console.log('reconnect :: connectInterval', connectInterval)
});

stream.on('disconnect', function (disconnectMessage) {
  console.log('disconnect', disconnectMessage);
});
