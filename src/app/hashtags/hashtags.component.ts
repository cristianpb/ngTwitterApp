import { Component, EventEmitter, Output, SimpleChanges, OnInit, Input } from '@angular/core';
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
  @Input() query: string;
  @Output() queryChange = new EventEmitter<string>();
  total_tweets: number = 0;

  constructor(private twitter: TwitterService) {}

  ngOnInit() { 
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.hashtags) {
      this.total_tweets = this.hashtags.filter(item => item.label == '#gswai')[0]['value']
    }
  }

  getTweetsByCity(tag: string) {
    this.twitter.tweetsByCity(tag.substr(1)).subscribe((tweets) => {
      this.tweetsChange.emit(tweets.data)
      this.queryChange.emit(tag.substr(1))
    });
  }


}
