import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Tweet } from '../tweet';
import { faRetweet, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

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
  faRetweet = faRetweet;
  faThumbsUp = faThumbsUp;

  hasPhoto(tweet: Tweet) {
    if (tweet.media) {
      if (tweet.media[0].type === 'photo') {
        return true;
      }
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

  hasRetweet(tweet: Tweet) {
    if (tweet.retweet_count > 0) {
        return true;
    }
    return false;
  }

  hasFavorite(tweet: Tweet) {
    if (tweet.favorite_count > 0) {
        return true;
    }
    return false;
  }

  toggleAction(property: 'favorite'|'retweet') {
    this.action.emit({property, tweet: this.tweet});
  }
}
