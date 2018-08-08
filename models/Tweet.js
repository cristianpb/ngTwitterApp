var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
  created_at: String,
  id: Number,
  id_str: String,
  text: String,
  full_text: String,
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
  source: String,
  in_reply_to_status_id: Number,
  in_reply_to_user_id: Number,
  in_reply_to_screen_name: String,
  user: {
    id: Number,
    name: String,
    screen_name: String,
    location: String,
    description: String,
    url: String,
    followers_count: Number,
    friends_count: Number,
    listed_count: Number,
    created_at: String,
    favourites_count: Number,
    utc_offset: Number,
    time_zone: String,
    verified: Boolean,
    statuses_count: Number,
    lang: String,
    profile_image_url_https: String,
    following: Boolean,
    follow_request_sent: Boolean,
  },
  retweet_count: Number,
  favorited: Boolean,
  retweeted: Boolean,
  lang: String,
});

// Create a static getTweets method to return tweet data from the db
schema.statics.getTweets = function(page, skip, callback) {

  var tweets = [],
      start = (page * 10) + (skip * 1);

  // Query the db, using skip and limit to achieve page chunks
  Tweet.find({},{},{skip: start, limit: 9}).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      tweets = docs;  // We got tweets
      tweets.forEach(function(tweet){
        tweet.active = true; // Set them to active
      });
    }

    // Pass them back to the specified callback
    callback(tweets);

  });

};


//schema.statics.getNoFavorites = new Promise(function (resolve, reject) {
//  Tweet.find({})
//    .cursor()
//    .on('data', function(doc) { console.log(doc.created_at); })
//    .on('end', function() { resolve('Succes') });
//})

// Return a Tweet model based upon the defined schema
module.exports = Tweet = mongoose.model('Tweet', schema);
