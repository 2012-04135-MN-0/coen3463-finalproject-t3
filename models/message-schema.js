var timestamps = require('mongoose-timestamp');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var Message = new Schema({
    sender: String,
    receiver: String,
    mes: String
});

Message.plugin(timestamps);
module.exports = mongoose.model('messages', Message);