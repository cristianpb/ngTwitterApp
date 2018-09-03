"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRepository_1 = require("./base/BaseRepository");
class MessageRepository extends BaseRepository_1.BaseRepository {
    countMessages() {
        return this._collection.count({});
    }
}
exports.MessageRepository = MessageRepository;
//# sourceMappingURL=MessageRepository.js.map