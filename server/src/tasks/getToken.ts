const graph = require('fbgraph');
import { ProcessFacebook } from '../lib/facebookPost';

//ProcessFacebook.getPost('GlobalSWAI').then((posts) => {
//  console.log(posts);
//})

const FB = new ProcessFacebook(process.env.FACEBOOK_ACCESSTOKEN_GSWAI, 'GlobalSWAI', `http://localhost:3001/api/news_gswai`);
FB.postNews().then(() => {
  console.log('DONE');
});
