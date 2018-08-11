import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Tweet } from '../tweet';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent {
  media: boolean = false;
  @Input() tweet: Tweet;
  @Input() retweet: Tweet;
  @Output() action = new EventEmitter<{property: string, tweet: Tweet}>();

  hasPhoto(tweet: Tweet) {
    if ('photo' in tweet) {
      return true;
    }
    return false;
  }

  toggleModal() {
    this.media = !this.media;
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
