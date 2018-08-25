import { BaseRepository } from "./base/BaseRepository";
import { Tweet } from "../entities/tweet"

export class TweetRepository extends BaseRepository<Tweet>{
    countTweets(): Promise<number> {
        return this._collection.count({})
    }
}
