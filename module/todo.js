const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    collection: 'UserInfo'  // This specifies the name of the collection in MongoDB
});

module.exports = mongoose.model('User', UserSchema);
