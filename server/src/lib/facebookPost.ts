const axios = require('axios');
const graph = require('fbgraph');
const FB = require('fb').default;

export class ProcessFacebook {
  token: string;
  facebook_page: string;
  news_url: string;

  constructor(token: string, facebook_page: string, news_url: string) {
    this.token = token;
    this.facebook_page = facebook_page;
    this.news_url = news_url;
  }

  static extendToken = function (temporalToken: string) {
    graph.extendAccessToken({
      'access_token': temporalToken,
      'client_id': process.env.FACEBOOK_CLIENT_ID,
      'client_secret':  process.env.FACEBOOK_CLIENT_SECRET
    }, function (err: any, facebookRes: any) {
       console.log(facebookRes);
    });
  };

  postNews = async () => {
    FB.options({accessToken: this.token});
    const article = await this.getArticle();
    if (article) {
    const content = await { message: article.description, link: article.url};
    console.log(content);
    const res = await FB.api(`${this.facebook_page}/feed`, 'post', content)
    console.log('Published, post Id: ' + res.id);
    }
  };

  getArticle = async function () {
    FB.options({accessToken: this.token});
    const news = await axios.get(this.news_url);
    const response = await FB.api(`${this.facebook_page}/posts`);
    const postsArray = await response.data.map((element: any) => element.message);
    const result = await news.data.data.filter((article: any) => postsArray.indexOf(article.description) === -1);
    return result[0];
  };

}
