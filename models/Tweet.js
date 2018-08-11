var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  twid: {type: String, index: true, unique: true},
  author: String,
  screenname: String,
  avatar: String,
  body: String,
  entities: {
    'media': [{
      id: Number,
      media_url_https: String,
      url: String,
      type: 'photo' | 'video',
      expanded_url: String,
      sizes: {
        thumb: {
          w: Number,
          h: Number,
          resize: 'fit' | 'crop',
        },
      },
    }],
    urls: [{
      display_url: String,
      expanded_url: String,
      url: String,
    }],
    user_mentions: [{
      screen_name: String,
      name: String,
      id: Number,
    }],
  },
  date: String,
  timestamp_ms: Number,
  hashtags: [String] //, lowercase: true, trim: true}]
})

// Create a static getTweets method to return tweet data from the db
schema.statics.getTweets = function(page, skip, callback) {

  var tweets = [],
      start = (page * 9) + (skip * 1);

  // Query the db, using skip and limit to achieve page chunks
  Tweet.find({},{},{skip: start}).sort({twid : 'desc'}).collation({locale: "en_US", numericOrdering: true}).limit(9).exec(function(err,docs){
    callback(docs);

  });

};

// Return a Tweet model based upon the defined schema
module.exports = Tweet = mongoose.model('Tweet', schema);
