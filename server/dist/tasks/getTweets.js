"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
// importing mongoClient to connect at mongodb
const mongodb_1 = require("mongodb");
const processTweet_1 = require("../lib/processTweet");
const colors_1 = require("colors");
const twit_1 = __importDefault(require("twit"));
const cron_1 = require("cron");
const mlab_username = process.env.MLAB_USERNAME;
const mlab_password = process.env.MLAB_PASSWORD;
const T = new twit_1.default({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
// creating a function that execute self runs
(() => __awaiter(this, void 0, void 0, function* () {
    // connecting at mongoClient
    const connection = yield mongodb_1.MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });
    //const connection = await MongoClient.connect(`mongodb://${mlab_username}:${mlab_password}@ds111192.mlab.com:11192/ng-tweets`, { useNewUrlParser: true });
    const db = connection.db('ng-tweets');
    console.log('Connected');
    const trackedTerms = ['GSWAI'];
    const stream = T.stream('statuses/filter', {
        track: trackedTerms
    });
    stream.on('tweet', function (tweet) {
        return __awaiter(this, void 0, void 0, function* () {
            console.time(colors_1.magenta(tweet.id_str));
            if ('retweeted_status' in tweet) {
                try {
                    const msg = yield processTweet_1.processTweet.saveTweets(db, tweet.retweeted_status);
                    console.log(msg);
                }
                catch (err) {
                    console.log(err);
                }
            }
            else {
                try {
                    const msg = yield processTweet_1.processTweet.saveTweets(db, tweet);
                    console.log(msg);
                }
                catch (err) {
                    console.log(err);
                }
            }
            console.timeEnd(colors_1.magenta(tweet.id_str));
        });
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
    const result = yield processTweet_1.processTweet.searchTweets(db, T, 'GSWAI');
    console.log(result);
    const job = new cron_1.CronJob({
        cronTime: '*/6 * * * *',
        onTick: function () {
            return __awaiter(this, void 0, void 0, function* () {
                /*
                 * At every 6 minutes
                 */
                const result = yield processTweet_1.processTweet.searchTweets(db, T, 'GSWAI');
                console.log(result);
            });
        },
        start: false,
        timeZone: 'Europe/Paris'
    });
    job.start();
}))();
//# sourceMappingURL=getTweets.js.map