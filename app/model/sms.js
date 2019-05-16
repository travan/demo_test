const mongoose = require('mongoose')

var messSchema = mongoose.Schema({
  id: String,
  phonenumber: String,
  content: String,
  sentAt: Date,
  telco: String,
  sms: Number
});

module.exports = mongoose.model('Message', messSchema);
