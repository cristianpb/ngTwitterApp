import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Tweet } from './tweet';

export interface TwitterResponse {
  data: any;
  resp: any;
}

@Injectable()
export class TwitterService {

  constructor(private http: HttpClient) { }

  // action(property: 'favorite'|'retweet', id: string, state: boolean) {
  //   return this.http.post<TwitterResponse>(`${environment.api}/${property}/${id}`, {state});
  // }

  stream() {
    return this.http.get<TwitterResponse>(`${environment.api}/stream`);
  }
}
