var MongoClient = require('mongodb').MongoClient
var mlab_username = process.env.MLAB_USERNAME
var mlab_password = process.env.MLAB_PASSWORD
var url = `mongodb://${mlab_username}:${mlab_password}@ds111192.mlab.com:11192/ng-tweets`
//var url = 'mongodb://localhost:27017'

MongoClient.connect(url, { useNewUrlParser: true }).then(client => {
  const db = client.db('ng-tweets')
  db.dropCollection('tweets')
    .then(msg => {
      var collection = db.collection('tweets')
      collection.createIndex( { "id_str": 1}, { unique: true } )
        .then(msj => {
          console.log(msj)
          client.close()
        })
        .catch(err => console.log(err))
    }
    )
    .catch(err => console.log(err));
})
