import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
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
  @Input() max_hashtags: number;
  @Input() tweets: Tweet[];
  @Output() tweetsChange = new EventEmitter<Tweet[]>();

  constructor(private twitter: TwitterService) {}

  ngOnInit() { }

  getTweetsByCity(tag: string) {
    this.twitter.tweetsByCity(tag.substr(1)).subscribe((tweets: Tweet[]) => {
      console.log(tweets.data);
      this.tweetsChange.emit(tweets.data)
    });
  }


}
