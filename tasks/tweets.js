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

MongoClient.connect(url, { useNewUrlParser: true })
  .then(client => {
    var db = client.db('ng-tweets')


    var stream = T.stream('statuses/filter', {
      track: ["#paris", "#lapaz", "#hongkong", "#sydney", "#bruxelles", "#carthage", "#douala", "#lima", "#istanbul", "#taipei", "#mexico"]
    });



    stream.on('tweet', function (tweet) {
      let err, msg;
      console.time(colors.magenta(tweet.id_str));
      if ('retweeted_status' in tweet) {
        //var tweetEntry = new Tweet(tweet.retweeted_status);
        saveTweets(db, tweet.retweeted_status, function(err, msg) {
          if (err) console.log(err);
          console.timeEnd(colors.magenta(tweet.id_str));
        })
      } else {
        //var tweetEntry = new Tweet(tweet);
        saveTweets(db, tweet, function (err, msg) {
          if (err) console.log(err);
          console.timeEnd(colors.magenta(tweet.id_str));
        })
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
      client.close()
      console.log('disconnect', disconnectMessage);
    });

  });

async function saveTweets (db, tweet, callback) {
  tweet = await Object.assign(tweet, {'timestamp_ms': moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').valueOf()});
  try {
    const collection = await db.collection('tweets')
    await collection.insertOne(tweet)
      .then(saveMetadata(db, tweet))
      .catch(err => {
        if (err.code !== 11000) console.log(err);
      })
    callback(null, `Saved ${tweet.id_str}`)
  } catch(err) {
    console.log('Error: ');
    return callback(err)
  };

}


async function saveHashtag (db, tweet, reg, type) {
  let text = await ('extended_tweet' in tweet) ? tweet.extended_tweet.full_text : tweet.text
  let hashtags = await text.match(reg);
  if (hashtags) {
    console.log('Text: ', text, '\n', type, ': ', hashtags);
    if (hashtags.length > 0) {
      await db.collection('tweets').findOneAndUpdate(
        {"id_str": tweet.id_str},
        { $set: { "hashtags": hashtags }}
      ).catch(err => console.log('Tweet update error', err))
      console.log(`updated tweet ${tweet.id_str}`)
      hashtags.forEach(tag => processHashtag(db, tag, hashtags, type, tweet))
    }
  } else {
    console.log(colors.red('Text: ', text, '\nNo ', type));
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
    console.log('updated hashtag: ', norm_tag)
  }
}

async function saveMetadata (db, tweet) {
  const msg3 = await saveHashtag(db, tweet, /\B(\#[a-zA-Z0-9]+\b)(?!;)/gm, 'hashtag')
  const msg4 = await saveHashtag(db, tweet, /\B(\@[a-zA-Z0-9]+\b)(?!;)/gm, 'mention')
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

