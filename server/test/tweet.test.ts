import { expect } from 'chai';
import { processTweet } from '../src/lib/processTweet';
import { Tweet } from '../src/entities/tweet';
import { rawTweet } from '../src/entities/rawTweet';

describe('Test tweet save', () => {
  it('Save a tweet', () => {
    const s = {};
    expect('foobar').to.have.string('bar')
  });
  it('Is banned', () => {
    let text = 'This text #porn'
    processTweet.isBanned(text).then((isBan) => {
      console.log(isBan);
      expect(isBan).to.be.true
    })
  });
  it('Not banned', () => {
    let text = 'This text have sexy and pornfam'
    processTweet.isBanned(text).then((isBan) => {
      console.log(isBan);
      expect(isBan).to.be.true
    })
  });
});
