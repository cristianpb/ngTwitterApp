import { Component , OnInit} from '@angular/core';
import { TwitterService } from './twitter.service';
import { Tweet } from './tweet';
import { Message } from './message';
import { faTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [TwitterService]
})
export class AppComponent implements OnInit {
  faTwitter = faTwitter;
  faFacebook = faFacebook;
  faInstagram = faInstagram;
  burger: boolean = false;

  constructor(private twitter: TwitterService) {}

  toggleBurger() {
    this.burger = !this.burger;
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

  ngOnInit() {
  }
}
