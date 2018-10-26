const mlab_username = process.env.MLAB_USERNAME;
const mlab_password = process.env.MLAB_PASSWORD;

export const environment = {
  // mongourl = `mongodb://${mlab_username}:${mlab_password}@ds111192.mlab.com:11192/ng-tweets`
  mongourl: 'mongodb://localhost:27017/ng-tweets'
};
