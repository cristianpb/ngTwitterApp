import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Tweet } from '../tweet';
import { Hashtag } from '../hashtag';
import { TwitterService } from '../twitter.service';

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.scss']
})
export class TweetsComponent implements OnInit, OnDestroy {
  inflight = false;
  tweets: Tweet[] = [];
  ids = [];
  timer;
  since = '';
  currentPage = 0;
  hashtags: Hashtag[] = [];
  max_hashtags = 0;

  constructor(private twitter: TwitterService) {}

  ngOnInit() {
    this.getStream();
    this.getHashtags();
    this.timer = setInterval(() => {
      this.getStream()
      this.getHashtags()
    }, 61000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  nextPage() {
    this.twitter.page++;
    this.currentPage++;
    this.getStream();
  }

  previousPage() {
    if (this.twitter.page > 0) {
      this.twitter.page--;
      this.currentPage--;
      this.getStream();
    }
  }

  getStream() {
    this.twitter.stream().subscribe(tweets => {
      console.log(tweets);
      this.tweets = tweets.data;
      // tweets.data.reverse().forEach(tweet => {
      //   if (this.ids.indexOf(tweet.id_str) < 0) {
      //     this.ids.push(tweet.id_str);
      //     this.tweets.unshift(tweet);
      //   }
      // });
      // this.since = this.tweets[0].id_str;
      // this.cleanUp();
    });
  }

  cleanUp() {
    if (this.tweets.length > 9) {
      this.tweets.splice(9);
      this.ids.splice(9);
    }
  }

  getHashtags() {
    this.twitter.hashtags().subscribe(hashtags => {
      this.hashtags = hashtags.data;
      hashtags.data.forEach(hashtag => {
        if (hashtag.value > this.max_hashtags) {
            this.max_hashtags = hashtag.value;
        }
      });
    });
  }

  // action(action, index) {
  //   if (this.inflight) {
  //     return;
  //   }

  //   const stateKey = action.property === 'favorite' ? 'favorited' : 'retweeted';
  //   const newState = !action.tweet[stateKey];

  //   this.inflight = true;
  //   this.twitter.action(action.property, action.tweet.id_str, newState).subscribe(tweet => {
  //     this.tweets[index][stateKey] = newState;
  //     this.tweets[index][action.property + '_count'] += newState ? 1 : -1;
  //     this.inflight = false;
  //   });
  // }
}
