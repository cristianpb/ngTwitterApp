import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Tweet } from '../tweet';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent {
  media = false;
  @Input() tweet: Tweet;
  @Input() retweet: Tweet;
  @Output() action = new EventEmitter<{property: string, tweet: Tweet}>();

  hasPhoto(tweet: Tweet) {
    if ('media' in tweet.entities) {
      if (tweet.entities.media.length
        && tweet.entities.media[0].type === 'photo') {
        return true;
      }
    }
    return false;
  }

  hasHashtags(tweet: Tweet) {
    if ('hashtags' in tweet) {
        return true;
    }
    return false;
  }


  toggleAction(property: 'favorite'|'retweet') {
    this.action.emit({property, tweet: this.tweet});
  }
}