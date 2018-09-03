import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { Hashtag } from '../hashtag';

@Component({
  selector: 'app-mapsvg',
  templateUrl: './mapsvg.component.html',
  styleUrls: ['./mapsvg.component.scss']
})
export class MapsvgComponent implements OnInit {
  @Input() hashtags: Hashtag[];
  result;
  value: number;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    this.result = this.hashtags.reduce(function(map, obj) {
      map[obj.label.substring(1)] = obj.value;
      return map;
    }, {});
  }

  ngOnInit() {
    this.value = 72;
  }

  mouseHover(e) {
    console.log('hovered', e.explicitOriginalTarget);
  }

}
