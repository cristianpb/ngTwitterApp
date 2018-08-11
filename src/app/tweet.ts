export class Tweet {
  _id: string;
  twid: string;
  author: string;
  screenname: string;
  entities: {
    hashtags: any[];
    symbols: any[];
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
    user_mentions: {
      screen_name: string;
      name: string;
      id: number;
    }[];
  };
  avatar: string;
  body: string;
  date: string;
  timestamp_ms: number;
  hashtags: string[];
}
