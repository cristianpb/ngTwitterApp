import { createServer, Server } from 'http';
import { Request, Response } from 'express';
import express from 'express';
import path from 'path';

import { MongoClient } from 'mongodb';
import { MessageRepository } from './repositories/MessageRepository';
import { Message } from './entities/message';

export class TweetServer {
  public static readonly PORT:number = 3001;
  private app: express.Application;
  private server: Server;
  private port: string | number;
  private db: any;

  constructor() {
    this.createApp();
    this.config();
    this.createServer();
    this.mongoConnect();
    this.static_content();
    this.routes();
    this.listen();
  }

  private mongoConnect(): void {
    console.log('Connected');
    MongoClient.connect('mongodb://localhost:27017').then(
      connection => {
      this.db = connection.db('ng-tweets');
      }
    );
  }

  private createApp(): void {
    this.app = express();
  }

  private createServer(): void {
    this.server = createServer(this.app);
  }

  private config(): void {
    this.port = process.env.PORT || TweetServer.PORT;
  }

  private static_content(): void {
    this.app.use(require('cors')());
    this.app.use(require('body-parser').json());
    this.app.use(express.static(path.join(__dirname, '../../dist')));
    this.app.get('/', (req,res) => {
      res.sendFile(path.join(__dirname, '../../dist/index.html'))
    });
  }

  private routes(): void {
    this.app.get('/api/tweets/:page', (req: Request, res: Response) => {
      this.getTweets(Number(req.params.page), 0).then(( tweets ) => {
        res.json({'data': tweets});
      })
    });

    this.app.get('/api/stream/hashtag', (req, res) => {
      this.getHashtags().then(( docs ) => {
        res.json({'data': docs});
      })
    });


    this.app.get('/api/read', (req, res) => {
      this.getMessages().then(( docs ) => {
        res.json({'data': docs});
      })
    });

    this.app.post('/api/write', (req: Request, res: Response) => {
      this.writeMessage(req.body.message).then(( result1 ) => {
        res.json({message: 'ok'});
      })
    });

    this.app.get('/messages', (req: Request, res: Response) => {
      //const repository = new MessageRepository(this.db, 'messages');
      //const count = repository.countMessages();
      //console.log(`the count of spartans is ${count}`);
      //const messageSear = new Message('', 1);
      //const mess = repository.find(messageSear);
      this.getMessages()
        .then((counted:any) => {
          console.log('count', counted);
          res.send(counted);
        })
    });
  }


  private async getTweets (page: number, skip: number) {
    let start = (page * 9) + (skip * 1)
    let docs = await this.db.collection('tweets')
      .find({},{skip: start})
      .sort({twid: -1})
      .limit(9)
      .toArray()
    return docs
  }

  private async getHashtags () {
    let docs = await this.db.collection('hashtags')
      .find({})
      .sort({value: -1})
      .limit(15)
      .toArray()
    //.find({"label":{"$in":["#paris", "#lapaz", "#hongkong", "#sydney", "#carthage", "#bruxelles", "#douala", "#lima", "#istanbul", "#taipei", "#mexico"]}})
    return docs
  }

  private async getMessages () {
    let docs = await this.db.collection('messages')
      .find({})
      .sort({timestamp: -1})
      .limit(3)
      .toArray()
    return docs
  }

  private async writeMessage (message: string) {
    let res1 = await this.db.collection('messages').insertOne({ message: message, timestamp: + new Date()})
    return res1
  }

  //private async getMessages () {
  //  const messageSear = new Message('', 1);
  //  const repository = new MessageRepository(this.db, 'messages');
  //  const mess = await repository.find(messageSear);
  //  return mess[0];
  //}

  private listen(): void {
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

  public getApp(): express.Application {
    return this.app;
  }
}
