import { MongoClient, Db, Collection, FindAndModifyWriteOpResultObject, InsertOneWriteOpResult } from 'mongodb';
import { BaseRepository } from "./base/BaseRepository";
import { Tweet } from "../entities/tweet"

export class TweetRepository extends BaseRepository<Tweet>{
    countTweets(): Promise<number> {
        return this._collection.count({})
    }
    async updateTweet(id: string, item: Tweet): Promise<boolean> {
      delete item._id;
      const result: any = await this._collection.findOneAndUpdate({"twid": item.twid}, {$set: item});
      return !!result.ok;
    }
}
