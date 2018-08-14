export class Tweet {
  _id: string;
  twid: string;
  author: string;
  screenname: string;
  media: {
    id: number;
    media_url_https: string;
    url: string;
    type: 'photo' | 'video';
    expanded_url: string;
    sizes: {
      thumb: {
        w: number;
        h: number;
        resize: 'fit' | 'crop';
      };
    };
  }[];
  urls: {
    display_url: string;
    expanded_url: string;
    url: string;
  }[];
  avatar: string;
  body: string;
  date: string;
  timestamp_ms: number;
  hashtags: string[];
  mentions: string[];
  quote_count: number;
  reply_count: number;
  retweet_count: number;
  favorite_count: number;
}
