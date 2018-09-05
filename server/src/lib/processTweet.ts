// importing mongoClient to connect at mongodb
import { MongoClient, Db, Collection, InsertOneWriteOpResult } from 'mongodb';
import { TweetRepository } from '../repositories/TweetRepository'
import { Tweet } from '../entities/tweet';
import { Article } from '../entities/article';
import { rawTweet } from '../entities/rawTweet';
import { magenta, red, blue, yellow, green } from 'colors';
import moment from 'moment';
import https from 'https';
const newsapi_key = process.env.NEWSAPI_KEY

export class processTweet {
  static saveTweets = async function (db: Db, data: rawTweet) {
    let tweet = await new Tweet(data);
    try {
      const isBan = await processTweet.isBanned(tweet.body);
      if (isBan) {
        return red(`Banned ${tweet.body}`);
      } else {
        let repository = new TweetRepository(db, 'tweets');
        const result = await repository.create(tweet);
        await processTweet.saveMetadata(db, tweet)
        return green(`Saved ${tweet.twid}`)
      }
    } catch(err) {
      if (err.code === 11000) {
        let repository = new TweetRepository(db, 'tweets');
        const result = await repository.updateTweet(tweet.twid, tweet);
        return blue(`Updated ${result}`)
      } else {
        throw new Error(err)
      }
    };
  };

  static isBanned = async function (text: string) {
    let bannedTerms = await ['#sex', '#porn', '#porno', 'porn', 'sex', 'porno', 'sexo'].join('|')
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
    let updateVal: SetTags = await {};
    if (annotationType === 'mention') {
      updateVal.mentions = hashtags
    }
    if (annotationType === 'hashtag') {
      updateVal.hashtags = hashtags
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
  };

  static searchTweets = async function (db: Db, T: any, trackTerm: string) {
    const enddate = moment().subtract(2, 'days').format('YYYY-MM-DD');
    let result = await T.get('search/tweets', {
      q: trackTerm,
      //until: enddate,
      count: 50,
      result_type: 'mixed',
      tweet_mode: 'extended'
    })
    if (result.data.statuses.length === 0) return 'Zero tweets found'
    console.log(`Total tweets ${result.data.statuses.length}`);
    await result.data.statuses.forEach(async function (tweet: rawTweet) {
      if (!('retweeted_status' in tweet)) {
        const msg = await processTweet.saveTweets(db, tweet);
        console.log(msg);
      } else {
        console.log(red(`Retweet ${tweet.retweeted_status.user.screen_name}`));
      }
    });
    return 'Processed tweets'
  };

  static searchNews = async (db: Db) => {
    https.get(`https://newsapi.org/v2/everything?q=intelligence%20artificielle&apiKey=${newsapi_key}&sortBy=publishedAt`, (resp) => {
      resp.setEncoding('utf8');
      resp.on('data', async (chunk: string) => {
        await db.dropCollection('news')
        processTweet.processNews(db, JSON.parse(chunk).articles)
      });
      resp.on('end', () => {});
    }).on('error', (err) => {
      console.log('Error: ' + err.message);
    });
  }

  static processNews = async (db: Db, articles: Article[]) => {
    articles.forEach(async (article) => {
      await db.collection('news').insertOne(article)
    })
  }

}

interface SetTags {
  mentions?: string[];
  hashtags?: string[];
}

interface ResultSearchTweets {
  data: any;
  resp: any;
}
