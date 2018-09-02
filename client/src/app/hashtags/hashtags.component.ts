import { Component, OnInit, Input } from '@angular/core';
import { Hashtag } from '../hashtag';

@Component({
  selector: 'app-hashtags',
  templateUrl: './hashtags.component.html',
  styleUrls: ['./hashtags.component.scss']
})
export class HashtagsComponent implements OnInit {
  @Input() hashtags: Hashtag[];

  constructor() {}

  ngOnInit() { }


}
