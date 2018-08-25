// importing mongoClient to connect at mongodb
import { MongoClient, Db, Collection, InsertOneWriteOpResult } from 'mongodb';
import { TweetRepository } from '../repositories/TweetRepository'
import { Tweet } from '../entities/tweet';
import { rawTweet } from '../entities/rawTweet';
import { magenta, red, blue, yellow } from 'colors';


export class processTweet {
  static saveTweets = async function (db: Db, data: rawTweet) {
    let tweet = new Tweet(data);
    try {
      let isBan = await processTweet.isBanned(tweet.body);
      if (isBan) {
        return red(`Banned ${tweet.body}`)
      } else { 
        const repository = new TweetRepository(db, 'tweets');
        const result = await repository.create(tweet);
        await processTweet.saveMetadata(db, tweet)
        return `Saved ${tweet.twid}`
      }
    } catch(err) {
      if (err.code !== 11000) {
        console.log(err);
        return blue(`Repeated tweet`)
      } else {
        throw new Error(err)
      }
    };
  };

  static isBanned = async function (text: string) {
    let bannedTerms = await ['#sex', '#porn', '#porno'].join('|')
    let regex2 = await new RegExp(`(?:^|(?<= ))(${bannedTerms})(?:(?= )|$)`, 'gim');
    if (!(regex2.test(text))) {
      return false
    } else { 
      return true
    }
  }

  static saveMetadata = async function  (db: Db, tweet: Tweet) {
    const msg3 = processTweet.saveHashtag(db, tweet, /#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])/gm, 'hashtag')
    const msg4 = processTweet.saveHashtag(db, tweet, /@(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])/gm, 'mention')
  }

  static saveHashtag = async function  (db: Db, tweet: Tweet, reg: RegExp, annotationType: string) {
    let hashtags = await tweet.body.match(reg);
    let updateVal: setTags = await {};
    if (annotationType === 'mention') {
      updateVal.mentions = hashtags
    }
    if (annotationType === 'hashtag') {
      updateVal.mentions = hashtags
    }
    if (hashtags) {
      console.log('Text: ', tweet.body, '\n', annotationType, ': ', hashtags);
      if (hashtags.length > 0) {
        try {
          await db.collection('tweets').findOneAndUpdate(
            {"twid": tweet.twid},
            { $set: updateVal}
          )
          console.log(`updated tweet ${tweet.twid}`)
          hashtags.forEach(tag => processTweet.processHashtag(db, tag, hashtags, annotationType))
        } catch (err) {
          console.log('Tweet update error', err)
        }
      }
    } else {
      console.log(yellow(`Text: ${tweet.body} \nNo ${annotationType}`));
    }
  }

  static processHashtag = async function  (db: Db, tag: string, hashtags: RegExpMatchArray, annotationType: string) {
    let norm_tag = await tag.toLowerCase()
    let docs = await db.collection('hashtags')
      .find({'label': norm_tag , 'type': annotationType})
      .toArray()
    if ( docs.length === 0 ) {
      let res1 = db.collection('hashtags').insertOne({'type': annotationType, 'label': norm_tag, 'value': 1})
      console.log('Creating tag: ', norm_tag);
    } else {
      try {
        await db.collection('hashtags').findOneAndUpdate(
          { 'label': norm_tag, 'type': annotationType },
          { $inc: { "value" : 1 }}
        )
        console.log('updated hashtag: ', norm_tag)
      } catch (err) {
        console.log('Hash update error', err)
      }
    }
  }
}

interface setTags {
  mentions?: string[];
  hashtags?: string[];
}
