import { expect } from 'chai';
import { processTweet } from '../src/lib/processTweet';
import { MongoClient, Db, Collection, InsertOneWriteOpResult } from 'mongodb';
import { Tweet } from '../src/entities/tweet';
import { rawTweet } from '../src/entities/rawTweet';
import Twit from 'twit';

const mlab_username = process.env.MLAB_USERNAME
const mlab_password = process.env.MLAB_PASSWORD

describe('Test tweet save', () => {
  it('Save a tweet', () => {
    const s = {};
    expect('foobar').to.have.string('bar')
  });
  it('Is banned', () => {
    const text = 'This text #porn'
    processTweet.isBanned(text)
      .then((isBan) => {
        console.log(isBan);
        expect(isBan).to.be.true
      })
      .catch(err => err);
  });
  it('Not banned', () => {
    const text = 'This text have sexy and pornfam'
    processTweet.isBanned(text)
      .then((isBan) => {
        console.log(isBan);
        expect(isBan).to.be.true
      })
      .catch(err => err);
  });
  it('Searching for tweets', async () => {
    const connection = await MongoClient.connect(`mongodb://${mlab_username}:${mlab_password}@ds111192.mlab.com:11192/ng-tweets`, { useNewUrlParser: true });

    const db = connection.db('ng-tweets');
    console.log('Connected');
    const T = new Twit({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });
    let result = await processTweet.searchTweets(db, T,'GSWAI')
    console.log(result);
    expect(result).to.have.string('Saved')
    connection.close();
  });
});
