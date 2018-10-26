// importing mongoClient to connect at mongodb
import { MongoClient, Db, Collection, InsertOneWriteOpResult } from 'mongodb';
import { TweetRepository } from '../repositories/TweetRepository';
import { Tweet } from '../entities/tweet';
import { Article } from '../entities/article';
import { rawTweet } from '../entities/rawTweet';
import { magenta, red, blue, yellow, green } from 'colors';
import moment from 'moment';

export class ProcessTweet {
  static saveTweets = async function (db: Db, data: rawTweet) {
    const tweet = await new Tweet(data);
    try {
      const isBan = await ProcessTweet.isBanned(tweet.body);
      if (isBan) {
        return red(`Banned ${tweet.body}`);
      } else {
        const repository = new TweetRepository(db, 'tweets');
        const result = await repository.create(tweet);
        await ProcessTweet.saveMetadata(db, tweet);
        return green(`Saved ${tweet.twid}`);
      }
    } catch (err) {
      if (err.code === 11000) {
        const repository = new TweetRepository(db, 'tweets');
        const result = await repository.updateTweet(tweet.twid, tweet);
        return blue(`Updated ${result}`);
      } else {
        throw new Error(err);
      }
    }
  };

  static isBanned = async function (text: string) {
    const bannedTerms = await ['#sex', '#porn', '#porno', 'porn', 'sex', 'porno', 'sexo'].join('|');
    const regex2 = await new RegExp(`(?:^|(?<= ))(${bannedTerms})(?:(?= )|$)`, 'gim');
    if (!(regex2.test(text))) {
      return false;
    } else {
      return true;
    }
  };

  static saveMetadata = async function  (db: Db, tweet: Tweet) {
    const msg3 = ProcessTweet.saveHashtag(db, tweet, /#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])/gm, 'hashtag');
    const msg4 = ProcessTweet.saveHashtag(db, tweet, /@(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])/gm, 'mention');
  };

  static saveHashtag = async function  (db: Db, tweet: Tweet, reg: RegExp, annotationType: string) {
    const hashtags = await tweet.body.match(reg);
    const updateVal: SetTags = await {};
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
          await db.collection('tweets').findOneAndUpdate(
            {'twid': tweet.twid},
            { $set: updateVal}
          );
          console.log(`updated tweet ${tweet.twid}`);
          hashtags.forEach(tag => ProcessTweet.processHashtag(db, tag, hashtags, annotationType));
        } catch (err) {
          console.log('Tweet update error', err);
        }
      }
    } else {
      console.log(yellow(`Text: ${tweet.body} \nNo ${annotationType}`));
    }
  };

  static processHashtag = async function  (db: Db, tag: string, hashtags: RegExpMatchArray, annotationType: string) {
    const norm_tag = await tag.toLowerCase();
    const docs = await db.collection('hashtags')
      .find({'label': norm_tag , 'type': annotationType})
      .toArray();
    if ( docs.length === 0 ) {
      const res1 = db.collection('hashtags').insertOne({'type': annotationType, 'label': norm_tag, 'value': 1});
      console.log('Creating tag: ', norm_tag);
    } else {
      try {
        await db.collection('hashtags').findOneAndUpdate(
          { 'label': norm_tag, 'type': annotationType },
          { $inc: { 'value' : 1 }}
        );
        console.log('updated hashtag: ', norm_tag);
      } catch (err) {
        console.log('Hash update error', err);
      }
    }
  };

  static searchTweets = async function (db: Db, T: any, trackTerm: string) {
    const enddate = moment().subtract(2, 'days').format('YYYY-MM-DD');
    const result = await T.get('search/tweets', {
      q: trackTerm,
      // until: enddate,
      count: 50,
      result_type: 'mixed',
      tweet_mode: 'extended'
    });
    if (result.data.statuses.length === 0) return 'Zero tweets found';
    console.log(`Total tweets ${result.data.statuses.length}`);
    await result.data.statuses.forEach(async function (tweet: rawTweet) {
      if (!('retweeted_status' in tweet)) {
        const msg = await ProcessTweet.saveTweets(db, tweet);
        console.log(msg);
      } else {
        console.log(red(`Retweet ${tweet.retweeted_status.user.screen_name}`));
      }
    });
    return 'Processed tweets';
  };
}


interface SetTags {
  mentions?: string[];
  hashtags?: string[];
}

interface ResultSearchTweets {
  data: any;
  resp: any;
}
