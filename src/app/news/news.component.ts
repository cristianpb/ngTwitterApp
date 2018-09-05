import { Component, OnInit } from '@angular/core';
import { TwitterService } from '../twitter.service';
import { Article } from '../../../server/src/entities/article';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  articles: Article[] = [];

  constructor(private twitter: TwitterService) {}

  ngOnInit() {
    this.getNews()
  }

  getNews() {
    this.twitter.getNews().subscribe(articles => {
      console.log(articles);
      this.articles = articles.data;
    });
  }

}
