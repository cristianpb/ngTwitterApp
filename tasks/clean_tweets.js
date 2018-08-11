var MongoClient = require('mongodb').MongoClient
var mlab_username = process.env.MLAB_USERNAME
var mlab_password = process.env.MLAB_PASSWORD
var url = `mongodb://${mlab_username}:${mlab_password}@ds111192.mlab.com:11192/ng-tweets`
//var url = 'mongodb://localhost:27017'

resetTweets()

async function resetTweets () {
  let client = await MongoClient.connect(url, { useNewUrlParser: true })
  let db = await client.db('ng-tweets')
  let msg = await db.dropCollection('tweets')
  let collection = await db.collection('tweets')
  let msg2 = await collection.createIndex( { "twid": 1}, { unique: true } )
  console.log('Index Created', msg2);
  let msg4 = await db.dropCollection('hashtags')
  let msg5 = await db.createCollection('hashtags')
  let msg3 = await client.close()
  console.log('Reset hashtags');
}

//MongoClient.connect(url, { useNewUrlParser: true }).then(client => {
//  const db = client.db('ng-tweets')
//  db.dropCollection('tweets')
//    .then(msg => {
//      var collection = db.collection('tweets')
//      collection.createIndex( { "id_str": 1}, { unique: true } )
//        .then(msj => {
//          console.log(msj)
//          db.dropCollection('hashtags')
//            .then(msg => {
//              db.createCollection('hashtags')
//              console.log(msg)
//              client.close()
//            }).catch(err => console.log(err))
//        }).catch(err => console.log(err))
//    }).catch(err => console.log(err));
//})
