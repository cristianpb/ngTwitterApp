import { BaseRepository } from "./base/BaseRepository";
import { Message } from "../entities/message"

export class MessageRepository extends BaseRepository<Message>{
    countMessages(): Promise<number> {
        return this._collection.count({})
    }
}
