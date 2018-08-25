//import { Request, Response } from "express";
//import express from "express";
//
//
//const app = express();
//
//app.get("/", (req: Request, res: Response) => res.send("Hello World!"));
//
//export default app;

import { createServer, Server } from 'http';
import { Request, Response } from 'express';
import express from 'express';
import path from 'path';

import { MongoClient } from 'mongodb';
import { MessageRepository } from './repositories/MessageRepository';
import { Message } from './entities/message';
//import { Tweet } from './model/tweet';
//import { Hashtag } from './model/hashtag';
//import { Message } from './model/message';

export class TweetServer {
  public static readonly PORT:number = 8080;
  private app: express.Application;
  private server: Server;
  private port: string | number;
  private db: any;

  constructor() {
    this.createApp();
    this.config();
    this.createServer();
    this.mongoConnect();
    this.routes();
    this.listen();
  }

  private mongoConnect(): void {
    console.log('Connected');
    MongoClient.connect('mongodb://localhost').then(
      connection => {
      this.db = connection.db('warriors');
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

  // private static_content(): void {
  //   this.app.use(require('cors')());
  //   this.app.use(require('body-parser').json());
  //   //this.app.use(express.static(path.join(__dirname, 'dist')));
  // }

  private routes(): void {
    this.app.get('/', (req: Request, res: Response) => {
      // Message.find({},{},{}).sort({timestamp: 'desc'}).limit(3).exec(function (err, docs) {
      //  res.json({'data': docs});
      // });
      // res.sendFile(path.join(__dirname, 'dist/index.html'))
      // console.log('should load dist files');

      //const repository = new MessageRepository(this.db, 'messages');
      //const count = repository.countMessages();
      //console.log(`the count of spartans is ${count}`);
      //const messageSear = new Message('', 1);
      //const mess = repository.find(messageSear);
      //console.log('HHHH',mess);
      this.getMessages()
        .then((counted:any) => {
          console.log('count', counted);
          res.send(counted);
        })
    });
  }

  private async getMessages () {
    const messageSear = new Message('', 1);
    const repository = new MessageRepository(this.db, 'messages');
    const mess = await repository.find(messageSear);
    return mess[0];
  }

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
