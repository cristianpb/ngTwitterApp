// importing mongoClient to connect at mongodb
import { MongoClient } from 'mongodb';
import { processTweet } from '../lib/processTweet';
import { ProcessFacebook } from '../lib/facebookPost';
import { magenta } from 'colors';
import https from 'https';

import Twit from 'twit';
import { CronJob } from 'cron';

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
  //      const msg = await processTweet.saveTweets(db, tweet.retweeted_status);
  //      console.log(msg);
  //    } catch (err) {
  //      console.log(err);
  //    }
  //  } else {
  //    try {
  //      const msg = await processTweet.saveTweets(db, tweet);
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

  const FB = new ProcessFacebook(process.env.FACEBOOK_ACCESSTOKEN, 'cityaiparis', `https://ng-tweet.herokuapp.com/api/news`);
  new CronJob({
    // At 12:05 on every day-of-week from Sunday through Friday.
    cronTime: '05 12 * * 0-5',
    onTick: async function () {
      await FB.postNews();
    },
    start: true,
    timeZone: 'Europe/Paris'
  });

  const fbGswai = new ProcessFacebook(process.env.FACEBOOK_ACCESSTOKEN_GSWAI, 'GlobalSWAI', `https://ng-tweet.herokuapp.com/api/news_gswai`);
  const fbFrench = new ProcessFacebook(process.env.FACEBOOK_ACCESSTOKEN, 'cityaiparis', `https://ng-tweet.herokuapp.com/api/news_fr`);
  new CronJob({
    // At 08:05 on every day-of-week from Sunday through Friday.
    cronTime: '5 8 * * 0-5',
    onTick: async function () {
      await fbFrench.postNews();
      await fbGswai.postNews();
    },
    start: true,
    timeZone: 'Europe/Paris'
  });

  new CronJob({
    cronTime: '00 */4 * * *',
    onTick: async function () {
      /*
       * At every 6 minutes
       */
      await processTweet.searchNews(db, 'news_gswai', 'artificial%20intelligence', 'top-headlines');
      await processTweet.searchNews(db, 'news_fr', '+intelligence%20AND%20+artificielle%20AND%20(paris%20OR%20france)%20-smartphone', 'everything');
      await processTweet.searchNews(db, 'news', '+artificial%20AND%20+intelligence%20AND%20(paris%20OR%20france)%20-smartphone', 'everything');
    },
    start: true,
    timeZone: 'Europe/Paris'
  });

  const result = await processTweet.searchTweets(db, T, 'GSWAI');
  console.log(result);
  new CronJob({
    cronTime: '*/6 * * * *',
    onTick: async function () {
      /*
       * At every 6 minutes
       */
      const result = await processTweet.searchTweets(db, T, 'GSWAI');
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
