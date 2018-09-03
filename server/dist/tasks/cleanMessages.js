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
const mongodb_1 = require("mongodb");
const mlab_username = process.env.MLAB_USERNAME;
const mlab_password = process.env.MLAB_PASSWORD;
//const url = `mongodb://${mlab_username}:${mlab_password}@ds111192.mlab.com:11192/ng-tweets`;
const url = 'mongodb://localhost:27017';
resetTweets();
function resetTweets() {
    return __awaiter(this, void 0, void 0, function* () {
        let client = yield mongodb_1.MongoClient.connect(url, { useNewUrlParser: true });
        let db = yield client.db('ng-tweets');
        let msg4 = yield db.dropCollection('messages');
        let msg5 = yield db.createCollection('messages');
        let msg3 = yield client.close();
        console.log('Reset messages');
    });
}
//# sourceMappingURL=cleanMessages.js.map