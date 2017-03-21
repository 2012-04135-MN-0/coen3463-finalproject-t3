var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: {
    	type: String,
    	required: true
    },
    first_name: String,
    last_name: String,
    course: String,
    guild: String,
    admin: Boolean
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', User);