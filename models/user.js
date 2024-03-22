const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true  // ye koi validation nahi hai
    }
});

userSchema.plugin(passportLocalMongoose);  // ye username, hash, salt add kar dega

userSchema.post('save', function (error, doc, next) { // unique: true se hua hai shayad
    if (error.name === 'MongoServerError' && error.code === 11000 && error.keyValue.email) {
        next(new Error('Email address was already taken, please choose a different one.'));
    } else {
        next(error);
    }
});


module.exports = mongoose.model('User', userSchema);