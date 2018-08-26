var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
  timestamp: Number,
  message: String
});

// Return a Tweet model based upon the defined schema
module.exports = Message = mongoose.model('Message', schema);
