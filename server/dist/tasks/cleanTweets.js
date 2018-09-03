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
const url = 'mongodb://localhost:27017/ng-tweets';
(() => __awaiter(this, void 0, void 0, function* () {
    const connection = yield mongodb_1.MongoClient.connect(url, { useNewUrlParser: true });
    const db = connection.db('ng-tweets');
    yield db.dropCollection('tweets');
    let collection_tweets = yield db.collection('tweets');
    yield collection_tweets.createIndex({ "twid": 1 }, { unique: true });
    console.log('Index Created');
    try {
        yield db.dropCollection('hashtags');
        let collection_tags = yield db.collection('hashtags');
        yield collection_tags.createIndex({ "label": 1 });
        yield connection.close();
        console.log('Reset hashtags');
    }
    catch (err) {
        console.log('Error hashtags', err);
    }
}))();
//# sourceMappingURL=cleanTweets.js.map