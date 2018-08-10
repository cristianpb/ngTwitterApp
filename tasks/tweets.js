var Twit = require('twit');
var colors = require('colors'); 
var moment = require('moment');

var T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var MongoClient = require('mongodb').MongoClient
var mlab_username = process.env.MLAB_USERNAME
var mlab_password = process.env.MLAB_PASSWORD
var url = `mongodb://${mlab_username}:${mlab_password}@ds111192.mlab.com:11192/ng-tweets?connectTimeoutMS=6000000`
//var url = 'mongodb://localhost:27017'

var Tweet = require('../models/Tweet');

var stream = T.stream('statuses/filter', {
  track: ["#paris", "#lapaz", "#hongkong", "#sydney", "#bruxelles", "#carthage", "#douala", "#lima", "#istanbul", "#taipei", "#mexico"]
});

stream.on('tweet', function (tweet) {
  if ('retweeted_status' in tweet) {
    //var tweetEntry = new Tweet(tweet.retweeted_status);
    saveTweets(url, tweet.retweeted_status)
  } else {
    //var tweetEntry = new Tweet(tweet);
    saveTweets(url, tweet)
  }
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

async function saveTweets (url, tweet) {
  //console.log(moment('Mon Aug 06 12:04:08 +0000 2018','ddd MMM DD HH:mm:ss Z YYYY').valueOf())
  tweet = await Object.assign(tweet, {'timestamp_ms': moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').valueOf()});
  let client = await MongoClient.connect(url, { useNewUrlParser: true,  wtimeout: 0 }).catch( async function(err) {
    console.log('Error: ');
    console.log(err)
    await sleep(5000);
    console.log('Trying to reconnect');
    let client = await MongoClient.connect(url, { useNewUrlParser: true,  wtimeout: 0 })
    return client
  });
  console.time(colors.magenta(tweet.id_str));
  const db = await client.db('ng-tweets')
  const collection = await db.collection('tweets')
  collection.insertOne(tweet)
    .then(saveMetadata(tweet, db))
    .catch(err => {
      console.log(err);
    })
}


async function saveHashtag (tweet, reg, type, db) {
  let text = await ('extended_tweet' in tweet) ? tweet.extended_tweet.full_text : tweet.text
  let hashtags = await text.match(reg);
  console.log(text);
  console.log(hashtags);
  if (hashtags) {
    if (hashtags.length > 0) {
      hashtags.forEach(tag => processHashtag(db, tag, hashtags, type, tweet))
    }
  }
}

async function processHashtag (db, tag, hashtags, type, tweet) {
  let norm_tag = await tag.toLowerCase()
  let docs = await db.collection('hashtags')
    .find({'label': norm_tag , 'type': type})
    .toArray()
  if ( docs.length === 0 ) {
    let res1 = db.collection('hashtags').insert({'type': type, 'label': norm_tag, 'value': 1})
    console.log('Creating tag: ', norm_tag);
  } else {
    await db.collection('hashtags').findOneAndUpdate(
      { 'label': norm_tag, 'type': type },
      { $inc: { "value" : 1 }}
    ).catch(err => console.log('Hash update error', err))
    console.log('updated hashtag')
  }
    await db.collection('tweets').findOneAndUpdate(
      {"id_str": tweet.id_str},
      { $set: { "hashtags": hashtags }}
    ).catch(err => console.log('Tweet update error', err))
    console.log('updated tweet')
}

async function saveMetadata (tweet, db) {
  const msg3 = await saveHashtag(tweet, /\B(\#[a-zA-Z0-9]+\b)(?!;)/gm, 'hashtag', db)
  const msg4 = await saveHashtag(tweet, /\B(\@[a-zA-Z0-9]+\b)(?!;)/gm, 'user_count', db)
  console.timeEnd(colors.magenta(tweet.id_str));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
