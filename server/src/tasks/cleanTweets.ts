import { MongoClient } from 'mongodb';
import { environment } from '../environment';

(async () => {
  const connection = await MongoClient.connect(environment.mongourl, { useNewUrlParser: true });
  const db = connection.db('ng-tweets');
  await db.dropCollection('tweets');
  const collection_tweets = await db.collection('tweets');
  await collection_tweets.createIndex( { 'twid': 1}, { unique: true } );
  await collection_tweets.createIndex( { body: 'text' } );
  console.log('Index Created');
  try {
    await db.dropCollection('hashtags');
    const collection_tags = await db.collection('hashtags');
    await collection_tags.createIndex( { 'label': 1} );
    await connection.close();
    console.log('Reset hashtags');
  } catch (err) {
    console.log('Error hashtags', err);
  }
})();
