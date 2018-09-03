"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// that class only can be extended
class BaseRepository {
    //we created constructor with arguments to manipulate mongodb operations
    constructor(db, collectionName) {
        this._collection = db.collection(collectionName);
    }
    // we add to method, the async keyword to manipulate the insert result
    // of method.
    create(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._collection.insertOne(item);
            // after the insert operations, we returns only ok property (that haves a 1 or 0 results)
            // and we convert to boolean result (0 false, 1 true)
            return !!result.result.ok;
        });
    }
    update(id, item) {
        throw new Error('Method not implemented.');
    }
    delete(id) {
        throw new Error('Method not implemented.');
    }
    find(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._collection.find(item).limit(9).toArray();
            return result;
        });
    }
    findOne(id) {
        throw new Error('Method not implemented.');
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map