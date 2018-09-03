"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
class Tweet {
    constructor(data) {
        this.twid = data.id_str;
        this.author = data.user.name;
        this.screenname = data.user.screen_name;
        this.avatar = data.user.profile_image_url_https;
        if ('extended_tweet' in data) {
            this.body = data.extended_tweet.full_text;
        }
        else if ('full_text' in data) {
            this.body = data.full_text;
        }
        this.urls = ('entities' in data) ? data.entities.urls : [];
        this.media = ('entities' in data) ? data.entities.media : [];
        this.date = data['created_at'];
        this.timestamp_ms = moment_1.default(data.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').valueOf();
        if ('quote_count' in data && data.quote_count > 0) {
            this.quote_count = data['quote_count'];
        }
        if ('reply_count' in data && data.reply_count > 0) {
            this.reply_count = data['reply_count'];
        }
        if ('retweet_count' in data && data.retweet_count > 0) {
            this.retweet_count = data['retweet_count'];
        }
        if ('favorite_count' in data && data.favorite_count > 0) {
            this.favorite_count = data['favorite_count'];
        }
    }
}
exports.Tweet = Tweet;
//# sourceMappingURL=tweet.js.map