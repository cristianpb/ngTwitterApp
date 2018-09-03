"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const mongodb_1 = require("mongodb");
class TweetServer {
    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.mongoConnect();
        this.static_content();
        this.routes();
        this.listen();
    }
    mongoConnect() {
        console.log('Connected');
        mongodb_1.MongoClient.connect('mongodb://localhost:27017').then(connection => {
            this.db = connection.db('ng-tweets');
        });
    }
    createApp() {
        this.app = express_1.default();
    }
    createServer() {
        this.server = http_1.createServer(this.app);
    }
    config() {
        this.port = process.env.PORT || TweetServer.PORT;
    }
    static_content() {
        this.app.use(require('cors')());
        this.app.use(require('body-parser').json());
        this.app.use(express_1.default.static(path_1.default.join(__dirname, '../../dist')));
        this.app.get('/', (req, res) => {
            res.sendFile(path_1.default.join(__dirname, '../../dist/index.html'));
        });
    }
    routes() {
        this.app.get('/api/tweets/:page', (req, res) => {
            this.getTweets(Number(req.params.page), 0).then((tweets) => {
                res.json({ 'data': tweets });
            });
        });
        this.app.get('/api/stream/hashtag', (req, res) => {
            this.getHashtags().then((docs) => {
                res.json({ 'data': docs });
            });
        });
        this.app.get('/api/read', (req, res) => {
            this.getMessages().then((docs) => {
                res.json({ 'data': docs });
            });
        });
        this.app.post('/api/write', (req, res) => {
            this.writeMessage(req.body.message).then((result1) => {
                res.json({ message: 'ok' });
            });
        });
        this.app.get('/messages', (req, res) => {
            //const repository = new MessageRepository(this.db, 'messages');
            //const count = repository.countMessages();
            //console.log(`the count of spartans is ${count}`);
            //const messageSear = new Message('', 1);
            //const mess = repository.find(messageSear);
            this.getMessages()
                .then((counted) => {
                console.log('count', counted);
                res.send(counted);
            });
        });
    }
    getTweets(page, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            let start = (page * 9) + (skip * 1);
            let docs = yield this.db.collection('tweets')
                .find({}, { skip: start })
                .sort({ twid: -1 })
                .limit(9)
                .toArray();
            return docs;
        });
    }
    getHashtags() {
        return __awaiter(this, void 0, void 0, function* () {
            let docs = yield this.db.collection('hashtags')
                .find({})
                .sort({ value: -1 })
                .limit(15)
                .toArray();
            //.find({"label":{"$in":["#paris", "#lapaz", "#hongkong", "#sydney", "#carthage", "#bruxelles", "#douala", "#lima", "#istanbul", "#taipei", "#mexico"]}})
            return docs;
        });
    }
    getMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            let docs = yield this.db.collection('messages')
                .find({})
                .sort({ timestamp: -1 })
                .limit(3)
                .toArray();
            return docs;
        });
    }
    writeMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let res1 = yield this.db.collection('messages').insertOne({ message: message, timestamp: +new Date() });
            return res1;
        });
    }
    //private async getMessages () {
    //  const messageSear = new Message('', 1);
    //  const repository = new MessageRepository(this.db, 'messages');
    //  const mess = await repository.find(messageSear);
    //  return mess[0];
    //}
    listen() {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        // this.io.on('connect', (socket: any) => {
        //   console.log('Connected client on port %s.', this.port);
        //   socket.on('message', (m: Message) => {
        //     console.log('[server](message): %s', JSON.stringify(m));
        //     this.io.emit('message', m);
        //   });
        //   socket.on('disconnect', () => {
        //     console.log('Client disconnected');
        //   });
        // });
    }
    getApp() {
        return this.app;
    }
}
TweetServer.PORT = 3001;
exports.TweetServer = TweetServer;
//# sourceMappingURL=tweet-server.js.map