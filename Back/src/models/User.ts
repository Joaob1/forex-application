const UserModel = require('mongoose').model('User', {
    name: String,
    email: String,
    password: String
});

module.exports = UserModel;