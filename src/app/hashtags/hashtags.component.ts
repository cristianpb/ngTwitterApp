import { Component, OnInit, Input } from '@angular/core';
import { Hashtag } from '../hashtag';
import { Tweet } from '../tweet';
import { TwitterService } from '../twitter.service';

@Component({
  selector: 'app-hashtags',
  templateUrl: './hashtags.component.html',
  styleUrls: ['./hashtags.component.scss']
})
export class HashtagsComponent implements OnInit {
  @Input() hashtags: Hashtag[];
  @Input() tweets: Tweet[];

  constructor(private twitter: TwitterService) {}

  ngOnInit() { }

  getTweetsByCity() {
    this.twitter.tweetsByCity('swaiparis').subscribe(tweets => {
      this.tweets = tweets.data;
      console.log(this.tweets);
    });
  }


}
