import { Component, OnInit } from '@angular/core';
import { TwitterService } from '../twitter.service';
import { Message } from '../message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  timer;

  constructor(private twitter: TwitterService) {}

  ngOnInit() {
    this.getMessageStream();
    this.timer = setInterval(() => this.getMessageStream(), 6000);
  }

  getMessageStream() {
    this.twitter.getMessage().subscribe(messages => {
      this.messages = messages.data;
    });
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }

    // The server will generate the id for this new hero
    const newMessage = {message: name};
    console.log(name);
    this.twitter.addMessage(newMessage)
      .subscribe(message => console.log(message));
  }


}
