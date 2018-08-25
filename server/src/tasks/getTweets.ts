// importing mongoClient to connect at mongodb
import { MongoClient } from 'mongodb';
import { processTweet } from '../lib/processTweet';
import { magenta } from 'colors';

import Twit from 'twit';

const mlab_username = process.env.MLAB_USERNAME
const mlab_password = process.env.MLAB_PASSWORD

const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// creating a function that execute self runs
(async () => {
  // connecting at mongoClient
  //const connection = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });
  const connection = await MongoClient.connect(`mongodb://${mlab_username}:${mlab_password}@ds111192.mlab.com:11192/ng-tweets`, { useNewUrlParser: true });

  const db = connection.db('ng-tweets');
  console.log('Connected');
  const stream = T.stream('statuses/filter', {
    track: ['paris']
  });

  stream.on('tweet', async function (tweet) {
    console.time(magenta(tweet.id_str));
    if ('retweeted_status' in tweet) {
      try {
        const msg = await processTweet.saveTweets(db, tweet.retweeted_status);
        console.log(msg);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const msg = await processTweet.saveTweets(db, tweet);
        console.log(msg);
      } catch (err) {
        console.log(err);
      }
    }
    console.timeEnd(magenta(tweet.id_str));
  });

  stream.on('limit', function (limitMessage) {
    console.log('Limit for User : on query has rechead!');
  });

  stream.on('warning', function (warning) {
    console.log('warning', warning);
  });

  // https://dev.twitter.com/streaming/overview/connecting
  stream.on('reconnect', function (request, response, connectInterval) {
    console.log('reconnect :: connectInterval', connectInterval);
  });

  stream.on('disconnect', function (disconnectMessage) {
    console.log('disconnect', disconnectMessage);
    connection.close();
  });
})();