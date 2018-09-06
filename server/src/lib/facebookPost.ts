import * as FB   from 'fb';
import https from 'https';
FB.options({'accessToken': process.env.FACEBOOK_ACCESSTOKEN})

export class ProcessFacebook {
  static extendToken = function (temporalToken: string) {
    FB.api('oauth/access_token', {
      client_id: process.env.FACEBOOK_CLIENT_ID,
      client_secret: process.env.FACEBOOK_CLIENT_SECRET,
      grant_type: 'fb_exchange_token',
      fb_exchange_token: temporalToken
    }, function (res: any) {
      if (!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
      }
      const accessToken = res.access_token;
      const expires = res.expires ? res.expires : 0;
      console.log(accessToken);
      console.log(expires);
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
        const content = { message: JSON.parse(data).data[0].description, link: JSON.parse(data).data[4].url}
        FB.api('cityaiparis/feed', 'post', content, function (res: any) {
          if (!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
          }
          console.log('Post Id: ' + res.id);
        });
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
