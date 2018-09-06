const graph = require('fbgraph');
const axios = require('axios');
graph.setAccessToken(process.env.FACEBOOK_ACCESSTOKEN);

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

  static postNews = async function (url: string) {
    const article = await ProcessFacebook.getArticle(url);
    const content = { message: article.description, link: article.url};
    console.log(content);
    graph.post('cityaiparis/feed', content, function (err: any, res: any) {
      if (!err) {
        console.log('Post Id: ' + res.id);
      } else {
      console.log(err);
      }
    });
  };

  static getArticle = async function (url: string) {
    const news = await axios.get(url);
    const posts: any = await ProcessFacebook.getPost;
    const postsArray = await posts.data.map((element: any) => element.message);
    const result = await news.data.data.filter((article: any) => postsArray.indexOf(article.description) === -1);
    return result[0];
  };

  static getPost = new Promise ((resolve, reject) => {
    graph.get('cityaiparis/posts', function(err: any, res: any) {
      resolve(res);
    });
  });

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
