import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TweetComponent } from './tweet/tweet.component';
import { TweetsComponent } from './tweets/tweets.component';
import { MapsvgComponent } from './mapsvg/mapsvg.component';
import { TweetPipe } from './tweet.pipe';
import { MomentModule } from 'angular2-moment';
import { HashtagsComponent } from './hashtags/hashtags.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MessagesComponent } from './messages/messages.component';
import { NewsComponent } from './news/news.component';
import { AppRoutingModule } from './/app-routing.module';
import { HighmapComponent } from './highmap/highmap.component';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  declarations: [
    AppComponent,
    TweetComponent,
    TweetsComponent,
    TweetPipe,
    HashtagsComponent,
    MessagesComponent,
    MapsvgComponent,
    NewsComponent,
    HighmapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MomentModule,
    FontAwesomeModule,
    AppRoutingModule,
    HighchartsChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
