import { MongoClient } from 'mongodb';

const mlab_username = process.env.MLAB_USERNAME;
const mlab_password = process.env.MLAB_PASSWORD;
//const url = `mongodb://${mlab_username}:${mlab_password}@ds111192.mlab.com:11192/ng-tweets`;
const url = 'mongodb://localhost:27017'

resetTweets()

async function resetTweets () {
  let client = await MongoClient.connect(url, { useNewUrlParser: true })
  let db = await client.db('ng-tweets')
  let msg4 = await db.dropCollection('messages')
  let msg5 = await db.createCollection('messages')
  let msg3 = await client.close()
  console.log('Reset messages');
}
