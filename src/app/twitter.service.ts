import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Tweet } from './tweet';
import { Message } from './message';

export interface TwitterResponse {
  data: any;
  resp: any;
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'responseType': 'text'
  })
};

export interface MessagePost {
  message: any;
}

@Injectable()
export class TwitterService {

  page: number = 0;
  constructor(private http: HttpClient) { }

  // action(property: 'favorite'|'retweet', id: string, state: boolean) {
  //   return this.http.post<TwitterResponse>(`${environment.api}/${property}/${id}`, {state});
  // }

  stream() {
    return this.http.get<TwitterResponse>(`${environment.api}/tweets/${this.page}`);
  }

  hashtags() {
    return this.http.get<TwitterResponse>(`${environment.api}/stream/hashtag`);
  }

  addMessage (message)  {
    return this.http.post<MessagePost>(`${environment.api}/write`, message, httpOptions);
  }

  getMessage() {
    return this.http.get<TwitterResponse>(`${environment.api}/read`);
  }

  getNews() {
    return this.http.get<any>(`${environment.api}/news`);
  }

}
