var timestamps = require('mongoose-timestamp');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var Comment = new Schema({
    postId: String,
    commentMes: String,
    user: String
});

Comment.plugin(timestamps);
module.exports = mongoose.model('comments', Comment);