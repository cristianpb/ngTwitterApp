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
const TweetRepository_1 = require("../repositories/TweetRepository");
const tweet_1 = require("../entities/tweet");
const colors_1 = require("colors");
const moment_1 = __importDefault(require("moment"));
class processTweet {
}
processTweet.saveTweets = function (db, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let tweet = yield new tweet_1.Tweet(data);
        try {
            const isBan = yield processTweet.isBanned(tweet.body);
            if (isBan) {
                return colors_1.red(`Banned ${tweet.body}`);
            }
            else {
                let repository = new TweetRepository_1.TweetRepository(db, 'tweets');
                const result = yield repository.create(tweet);
                yield processTweet.saveMetadata(db, tweet);
                return colors_1.green(`Saved ${tweet.twid}`);
            }
        }
        catch (err) {
            if (err.code === 11000) {
                let repository = new TweetRepository_1.TweetRepository(db, 'tweets');
                const result = yield repository.updateTweet(tweet.twid, tweet);
                return colors_1.blue(`Updated ${result}`);
            }
            else {
                throw new Error(err);
            }
        }
        ;
    });
};
processTweet.isBanned = function (text) {
    return __awaiter(this, void 0, void 0, function* () {
        let bannedTerms = yield ['#sex', '#porn', '#porno', 'porn', 'sex', 'porno', 'sexo'].join('|');
        let regex2 = yield new RegExp(`(?:^|(?<= ))(${bannedTerms})(?:(?= )|$)`, 'gim');
        if (!(regex2.test(text))) {
            return false;
        }
        else {
            return true;
        }
    });
};
processTweet.saveMetadata = function (db, tweet) {
    return __awaiter(this, void 0, void 0, function* () {
        const msg3 = processTweet.saveHashtag(db, tweet, /#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])/gm, 'hashtag');
        const msg4 = processTweet.saveHashtag(db, tweet, /@(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])/gm, 'mention');
    });
};
processTweet.saveHashtag = function (db, tweet, reg, annotationType) {
    return __awaiter(this, void 0, void 0, function* () {
        let hashtags = yield tweet.body.match(reg);
        let updateVal = yield {};
        if (annotationType === 'mention') {
            updateVal.mentions = hashtags;
        }
        if (annotationType === 'hashtag') {
            updateVal.hashtags = hashtags;
        }
        if (hashtags) {
            console.log('Text: ', tweet.body, '\n', annotationType, ': ', hashtags);
            if (hashtags.length > 0) {
                try {
                    yield db.collection('tweets').findOneAndUpdate({ "twid": tweet.twid }, { $set: updateVal });
                    console.log(`updated tweet ${tweet.twid}`);
                    hashtags.forEach(tag => processTweet.processHashtag(db, tag, hashtags, annotationType));
                }
                catch (err) {
                    console.log('Tweet update error', err);
                }
            }
        }
        else {
            console.log(colors_1.yellow(`Text: ${tweet.body} \nNo ${annotationType}`));
        }
    });
};
processTweet.processHashtag = function (db, tag, hashtags, annotationType) {
    return __awaiter(this, void 0, void 0, function* () {
        let norm_tag = yield tag.toLowerCase();
        let docs = yield db.collection('hashtags')
            .find({ 'label': norm_tag, 'type': annotationType })
            .toArray();
        if (docs.length === 0) {
            let res1 = db.collection('hashtags').insertOne({ 'type': annotationType, 'label': norm_tag, 'value': 1 });
            console.log('Creating tag: ', norm_tag);
        }
        else {
            try {
                yield db.collection('hashtags').findOneAndUpdate({ 'label': norm_tag, 'type': annotationType }, { $inc: { "value": 1 } });
                console.log('updated hashtag: ', norm_tag);
            }
            catch (err) {
                console.log('Hash update error', err);
            }
        }
    });
};
processTweet.searchTweets = function (db, T, trackTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const enddate = moment_1.default().subtract(2, 'days').format('YYYY-MM-DD');
        let result = yield T.get('search/tweets', {
            q: trackTerm,
            //until: enddate,
            count: 50,
            result_type: 'mixed',
            tweet_mode: 'extended'
        });
        if (result.data.statuses.length === 0)
            return 'Zero tweets found';
        console.log(`Total tweets ${result.data.statuses.length}`);
        yield result.data.statuses.forEach(function (tweet) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!('retweeted_status' in tweet)) {
                    const msg = yield processTweet.saveTweets(db, tweet);
                    console.log(msg);
                }
                else {
                    console.log(colors_1.red(`Retweet ${tweet.retweeted_status.user.screen_name}`));
                }
            });
        });
        return 'Processed tweets';
    });
};
exports.processTweet = processTweet;
//# sourceMappingURL=processTweet.js.map