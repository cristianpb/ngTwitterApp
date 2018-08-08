var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
  hashtag: String,
  value: Number
});

// Create a static getTweets method to return tweet data from the db
schema.statics.getHashtags = function(page, skip, callback) {

  var tweets = [],
      start = (page * 10) + (skip * 1);

  // Query the db, using skip and limit to achieve page chunks
  Hashtags.find({},{},{skip: start, limit: 9}).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      docs.forEach(function(tweet){
        tweet.active = true; // Set them to active
      });
    }

    // Pass them back to the specified callback
    callback(docs);

  });

};

// Return a Tweet model based upon the defined schema
module.exports = Hashtag = mongoose.model('Hashtag', schema);
