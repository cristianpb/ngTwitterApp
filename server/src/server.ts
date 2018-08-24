//import app from "./app";
//
//const server = app.listen(3000, () => {
//   console.log("App is running...");
//   console.log("Press Ctrl-C to stop");
//});
//
//export default server;

import { TweetServer } from './tweet-server';

let app = new TweetServer().getApp();
export { app };
