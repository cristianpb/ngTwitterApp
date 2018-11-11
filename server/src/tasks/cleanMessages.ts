import { MongoClient } from 'mongodb';
import { environment } from '../environment';

resetTweets();

async function resetTweets () {
  const client = await MongoClient.connect(environment.mongourl, { useNewUrlParser: true });
  const db = await client.db('ng-tweets');
  const msg4 = await db.dropCollection('messages');
  const msg5 = await db.createCollection('messages');
  const msg3 = await client.close();
  console.log('Reset messages');
}
