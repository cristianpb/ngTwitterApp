import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { Hashtag } from '../hashtag';
import * as Highcharts from 'highcharts/highmaps';
require('../../js/worldmap')(Highcharts);

@Component({
  selector: 'app-highmap',
  templateUrl: './highmap.component.html',
  styleUrls: ['./highmap.component.scss']
})
export class HighmapComponent implements OnInit {
  @Input() hashtags: Hashtag[];
  updateFlag = false;
  Highcharts = Highcharts;
  data = [
    ['fo', ''],
    ['um', ''],
    ['us', ''],
    ['jp', ''],
    ['sc', ''],
    ['in', ''],
    ['fr', ''],
    ['fm', ''],
    ['cn', ''],
    ['pt', ''],
    ['sw', ''],
    ['sh', ''],
    ['br', ''],
    ['ki', ''],
    ['ph', ''],
    ['mx', ''],
    ['es', ''],
    ['bu', ''],
    ['mv', ''],
    ['sp', ''],
    ['gb', ''],
    ['gr', ''],
    ['as', ''],
    ['dk', ''],
    ['gl', ''],
    ['gu', ''],
    ['mp', ''],
    ['pr', ''],
    ['vi', ''],
    ['ca', ''],
    ['st', ''],
    ['cv', ''],
    ['dm', ''],
    ['nl', ''],
    ['jm', ''],
    ['ws', ''],
    ['om', ''],
    ['vc', ''],
    ['tr', ''],
    ['bd', ''],
    ['lc', ''],
    ['nr', ''],
    ['no', ''],
    ['kn', ''],
    ['bh', ''],
    ['to', ''],
    ['fi', ''],
    ['id', ''],
    ['mu', ''],
    ['se', ''],
    ['tt', ''],
    ['my', ''],
    ['pa', ''],
    ['pw', ''],
    ['tv', ''],
    ['mh', ''],
    ['cl', ''],
    ['th', ''],
    ['gd', ''],
    ['ee', ''],
    ['ag', ''],
    ['tw', ''],
    ['bb', ''],
    ['it', ''],
    ['mt', ''],
    ['vu', ''],
    ['sg', ''],
    ['cy', ''],
    ['lk', ''],
    ['km', ''],
    ['fj', ''],
    ['ru', ''],
    ['va', ''],
    ['sm', ''],
    ['kz', ''],
    ['az', ''],
    ['tj', ''],
    ['ls', ''],
    ['uz', ''],
    ['ma', ''],
    ['co', ''],
    ['tl', ''],
    ['tz', ''],
    ['ar', ''],
    ['sa', ''],
    ['pk', ''],
    ['ye', ''],
    ['ae', ''],
    ['ke', ''],
    ['pe', ''],
    ['do', ''],
    ['ht', ''],
    ['pg', ''],
    ['ao', ''],
    ['kh', ''],
    ['vn', ''],
    ['mz', ''],
    ['cr', ''],
    ['bj', ''],
    ['ng', ''],
    ['ir', ''],
    ['sv', ''],
    ['sl', ''],
    ['gw', ''],
    ['hr', ''],
    ['bz', ''],
    ['za', ''],
    ['cf', ''],
    ['sd', ''],
    ['cd', ''],
    ['kw', ''],
    ['de', ''],
    ['be', ''],
    ['ie', ''],
    ['kp', ''],
    ['kr', ''],
    ['gy', ''],
    ['hn', ''],
    ['mm', ''],
    ['ga', ''],
    ['gq', ''],
    ['ni', ''],
    ['lv', ''],
    ['ug', ''],
    ['mw', ''],
    ['am', ''],
    ['sx', ''],
    ['tm', ''],
    ['zm', ''],
    ['nc', ''],
    ['mr', ''],
    ['dz', ''],
    ['lt', ''],
    ['et', ''],
    ['er', ''],
    ['gh', ''],
    ['si', ''],
    ['gt', ''],
    ['ba', ''],
    ['jo', ''],
    ['sy', ''],
    ['mc', ''],
    ['al', ''],
    ['uy', ''],
    ['cnm',''],
    ['mn', ''],
    ['rw', ''],
    ['so', ''],
    ['bo', ''],
    ['cm', ''],
    ['cg', ''],
    ['eh', ''],
    ['rs', ''],
    ['me', ''],
    ['tg', ''],
    ['la', ''],
    ['af', ''],
    ['ua', ''],
    ['sk', ''],
    ['jk', ''],
    ['bg', ''],
    ['qa', ''],
    ['li', ''],
    ['at', ''],
    ['sz', ''],
    ['hu', ''],
    ['ro', ''],
    ['ne', ''],
    ['lu', ''],
    ['ad', ''],
    ['ci', ''],
    ['lr', ''],
    ['bn', ''],
    ['iq', ''],
    ['ge', ''],
    ['gm', ''],
    ['ch', ''],
    ['td', ''],
    ['kv', ''],
    ['lb', ''],
    ['dj', ''],
    ['bi', ''],
    ['sr', ''],
    ['il', ''],
    ['ml', ''],
    ['sn', ''],
    ['gn', ''],
    ['zw', ''],
    ['pl', ''],
    ['mk', ''],
    ['py', ''],
    ['by', ''],
    ['cz', ''],
    ['bf', ''],
    ['na', ''],
    ['ly', ''],
    ['tn', ''],
    ['bt', ''],
    ['md', ''],
    ['ss', ''],
    ['bw', ''],
    ['bs', ''],
    ['nz', ''],
    ['cu', ''],
    ['ec', ''],
    ['au', ''],
    ['ve', ''],
    ['sb', ''],
    ['mg', ''],
    ['is', ''],
    ['eg', ''],
    ['kg', ''],
    ['np', '']
  ];

  chartMap = {
    chart: {
      map: 'myMapName'
    },
    title: {
      text: '',
      enabled: false
    },
    mapNavigation: {
      enabled: false,
      buttonOptions: {
        alignTo: 'spacingBox'
      }
    },
    colorAxis: {
      min: 0
    },
    tooltip: {
      formatter: function () {
        return `<b> ${this.point.name} </b><br>` +
          `${this.point.value? this.point.value : 0} tweets`;
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 600
        },
        chartOptions: {
          chart: {
            height: 200
          },
          subtitle: {
            text: null
          },
          navigator: {
            enabled: false
          }
        }
      }]
    },
    series: [{
      name: 'Tweets by city',
      states: {
        hover: {
          color: '#edbb1e'
        }
      },
      dataLabels: {
        enabled: true,
        format: '{point.name} {point.value}',
        filter: {
          property: 'value',
          operator: '>',
          value: -1
        }
      },
      allAreas: false,
      data: this.data
    }]
  };

  mydict: any = {
    '#swailapaz': 'bo',
    '#swaihk': 'ch',
    '#swaiyaounde': 'cm',
    '#swaibrussels': 'be',
    '#swaiparis': 'fr',
    '#swaiizmir': 'tr',
    '#swailima': 'pe',
    '#swaimtl': 'ca',
    '#swaitaipei': 'tw',
    '#swaijeddah': 'sa',
    '#swaiszczecin': 'po',
    '#swaibeirut': 'lb',
    '#swaiguayaquil': 'ec',
    '#swaiantananarivo': 'mg'
  };

  ngOnInit() {
    let initial_data = this.data;
    const mydict2 = this.mydict;
    this.hashtags.forEach((elem) => {
      const p: any = initial_data.filter(function(el) {
        return (el['hc-key'] !== mydict2[elem.label]);
      });
      p.push({
        'hc-key': mydict2[elem.label],
        'value': elem.value,
        'label': elem.label
      });
      initial_data = p;
    });
    this.chartMap.series = [{
      name: 'Randoiiiiim data',
      states: {
        hover: {
          color: '#edbb1e'
        }
      },
      dataLabels: {
        enabled: true,
        format: '{point.name} {point.value}',
        filter: {
          property: 'value',
          operator: '>',
          value: 0
        }
      },
      allAreas: false,
      data: initial_data
    }];
    this.updateFlag = true;
  }

  ngOnChanges(changes: SimpleChanges) {

    let initial_data = this.data;
    const mydict2 = this.mydict;
    this.hashtags.forEach((elem) => {
      const p: any = initial_data.filter(function(el) {
        return (el['hc-key'] !== mydict2[elem.label]);
      });
      p.push({
        'hc-key': mydict2[elem.label],
        'value': elem.value,
        'label': elem.label
      });
      initial_data = p;
    });
    this.chartMap.series = [{
      name: 'Randoiiiiim data',
      states: {
        hover: {
          color: '#edbb1e'
        }
      },
      dataLabels: {
        enabled: true,
        format: '{point.name} {point.value}',
        filter: {
          property: 'value',
          operator: '>',
          value: 0
        }
      },
      allAreas: false,
      data: initial_data
    }];
    this.updateFlag = true;
  }

}
