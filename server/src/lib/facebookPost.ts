const graph = require('fbgraph');
import https from 'https';

graph.setAccessToken({'accessToken': process.env.FACEBOOK_ACCESSTOKEN});

export class ProcessFacebook {
  static extendToken = function (temporalToken: string) {
    graph.extendAccessToken({
      'access_token':    temporalToken,
      'client_id': process.env.FACEBOOK_CLIENT_ID,
      'client_secret':  process.env.FACEBOOK_CLIENT_SECRET
    }, function (err: any, facebookRes: any) {
       console.log(facebookRes);
    });
  };

  static postNews = function () {
    const data: string[] = [];
    https.get('https://ng-tweet.herokuapp.com/api/news', (res) => {
      res.setEncoding('utf8');
      res.on('data', (d) => {
        data.push(d);
      });
      res.on('end', () => {
        const content = { message: JSON.parse(data.join()).data[0].description, link: JSON.parse(data.join()).data[0].url};
        //graph.post('cityaiparis/feed', content, function (res: any) {
        //  if (!res || res.error) {
        //    console.log(!res ? 'error occurred' : res.error);
        //    return;
        //  }
        //  console.log('Post Id: ' + res.id);
        //});
      }).on('error', (e) => {
        console.error(e);
      });
    });
  };

//FB.api('cityaiparis?fields=access_token', function (res) {
//  if(!res || res.error) {
//   console.log(!res ? 'error occurred' : res.error);
//   return;
//  }
//  console.log(res);
//});

//FB.api('cityaiparis/posts', function (res) {
//  if(!res || res.error) {
//   console.log(!res ? 'error occurred' : res.error);
//   return;
//  }
//  console.log(res);
//});

//var postId = '178795452811011_238675936822962';
//FB.api(postId, 'delete', function (res) {
//  if(!res || res.error) {
//    console.log(!res ? 'error occurred' : res.error);
//    return;
//  }
//  console.log('Post was deleted');
//});

}
