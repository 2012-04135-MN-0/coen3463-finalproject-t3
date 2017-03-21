var timestamps = require('mongoose-timestamp');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var Tutorial = new Schema({
    guild: String,
    first_name: String,
    last_name: String,
    message: String,
});

Tutorial.plugin(timestamps);
module.exports = mongoose.model('tutorials', Tutorial);