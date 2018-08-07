import { Component, OnInit, OnDestroy } from '@angular/core';
import { Hashtag } from '../hashtag';
import { TwitterService } from '../twitter.service';

@Component({
  selector: 'app-hashtags',
  templateUrl: './hashtags.component.html',
  styleUrls: ['./hashtags.component.scss']
})
export class HashtagsComponent implements OnInit, OnDestroy {
  hashtags: Hashtag[] = [];
  constructor(private twitter: TwitterService) {}
  timer;
  max_hashtags = 0;

  ngOnInit() {
    this.getHashtags();
    this.timer = setInterval(() => this.getHashtags(), 61000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  getHashtags() {
    this.twitter.hashtags().subscribe(hashtags => {
      hashtags.data.forEach(hashtag => {
        if (hashtag.value > this.max_hashtags) {
          this.max_hashtags = hashtag.value
        }
        this.hashtags.unshift(hashtag)
      });
    });
  }

}
