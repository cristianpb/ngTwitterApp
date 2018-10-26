// importing mongoClient to connect at mongodb
import { MongoClient } from 'mongodb';
import { ProcessTweet } from '../lib/processTweet';
import { magenta } from 'colors';
import { environment } from '../environment';
import https from 'https';

import Twit from 'twit';
import { CronJob } from 'cron';

const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// creating a function that execute self runs
(async () => {
  // connecting at mongoClient
  const connection = await MongoClient.connect(environment.mongourl, { useNewUrlParser: true });

  const db = await connection.db('ng-tweets');
  console.log('Connected');
  //const trackedTerms = ['GSWAI'];
  //const stream = T.stream('statuses/filter', {
  //  track: trackedTerms
  //});

  //stream.on('tweet', async function (tweet) {
  //  console.time(magenta(tweet.id_str));
  //  if ('retweeted_status' in tweet) {
  //    try {
  //      const msg = await ProcessTweet.saveTweets(db, tweet.retweeted_status);
  //      console.log(msg);
  //    } catch (err) {
  //      console.log(err);
  //    }
  //  } else {
  //    try {
  //      const msg = await ProcessTweet.saveTweets(db, tweet);
  //      console.log(msg);
  //    } catch (err) {
  //      console.log(err);
  //    }
  //  }
  //  console.timeEnd(magenta(tweet.id_str));
  //});

  //stream.on('limit', function (limitMessage) {
  //  console.log('Limit for User : on query has rechead!');
  //});

  //stream.on('warning', function (warning) {
  //  console.log('warning', warning);
  //});

  //// https://dev.twitter.com/streaming/overview/connecting
  //stream.on('reconnect', function (request, response, connectInterval) {
  //  console.log('reconnect :: connectInterval', connectInterval);
  //});

  //stream.on('disconnect', function (disconnectMessage) {
  //  console.log('disconnect', disconnectMessage);
  //  connection.close();
  //});

  const result = await ProcessTweet.searchTweets(db, T, 'GSWAI');
  console.log(result);
  new CronJob({
    cronTime: '*/6 * * * *',
    onTick: async function () {
      /*
       * At every 6 minutes
       */
      const result = await ProcessTweet.searchTweets(db, T, 'GSWAI');
      console.log(result);
    },
    start: true,
    timeZone: 'Europe/Paris'
  });
  new CronJob({
    cronTime: '*/15 6-23 * * *',
    onTick: () => {
      /*
       * At every 15th minute past every hour from 6 through 23.
       */
      https.get(`https://ng-tweet.herokuapp.com/api/stream/hashtag`, (resp) => {
        resp.on('data', () => {});
        // The whole response has been received. Print out the result.
        resp.on('end', () => {});
      }).on('error', (err) => {
        console.log('Error: ' + err.message);
      });
    },
    start: true,
    timeZone: 'Europe/Paris'
  });
})();
