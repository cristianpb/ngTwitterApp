import { MongoClient } from 'mongodb';

const mlab_username = process.env.MLAB_USERNAME;
const mlab_password = process.env.MLAB_PASSWORD;
//const url = `mongodb://${mlab_username}:${mlab_password}@ds111192.mlab.com:11192/ng-tweets`;
const url = 'mongodb://localhost:27017/ng-tweets';

(async () => {
  const connection = await MongoClient.connect(url, { useNewUrlParser: true });
  const db = connection.db('ng-tweets');

  await db.dropCollection('tweets')
  let collection_tweets = await db.collection('tweets')
  await collection_tweets.createIndex( { "twid": 1}, { unique: true } )
  console.log('Index Created');
  try {
    await db.dropCollection('hashtags')
    let collection_tags = await db.collection('hashtags')
    await collection_tags.createIndex( { "label": 1} )
    await connection.close()
    console.log('Reset hashtags');
  } catch(err) {
    console.log('Error hashtags', err);
  }
})();
