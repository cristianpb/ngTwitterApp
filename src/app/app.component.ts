import { Component , OnInit} from '@angular/core';
import { TwitterService } from './twitter.service';
import { Tweet } from './tweet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [TwitterService]
})
export class AppComponent implements OnInit {

  constructor(private twitter: TwitterService) {}

  ngOnInit() {
  }
}
